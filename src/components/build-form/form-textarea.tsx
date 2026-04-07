"use client"

import { useState, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { cn } from "@/lib/utils"

interface FormTextareaProps {
  label: string
  placeholder?: string
  isRequired?: boolean
  maxLength?: number
  className?: string
  onChange?: (html: string) => void
  error?: boolean
}

function ToolbarButton({
  icon,
  title,
  active,
  onClick,
}: {
  icon: string
  title: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
        active
          ? "text-primary bg-primary/8"
          : "text-on-surface/40 hover:text-on-surface/70 hover:bg-surface-container"
      )}
    >
      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>{icon}</span>
    </button>
  )
}

export function FormTextarea({
  label,
  placeholder,
  isRequired,
  maxLength,
  className,
  onChange,
  error,
}: FormTextareaProps) {
  const [, setUpdateKey] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const forceToolbarUpdate = useCallback(() => {
    setUpdateKey((k) => k + 1)
  }, [])

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
        codeBlock: false,
        code: false,
        horizontalRule: false,
        blockquote: false,
        strike: false,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "tiptap focus:outline-none min-h-[40px] text-[14px] leading-[1.8] font-body text-on-surface",
        "data-placeholder": placeholder || "Start writing...",
      },
      handleTextInput: maxLength
        ? (view, from, to, text) => {
            const currentLen = view.state.doc.textContent.length
            const insertLen = text.length - (to - from)
            if (currentLen + insertLen > maxLength) return true
            return false
          }
        : undefined,
      handlePaste: maxLength
        ? (view, event) => {
            const clipboardText = event.clipboardData?.getData("text/plain") || ""
            const { from, to } = view.state.selection
            const currentLen = view.state.doc.textContent.length
            const insertLen = clipboardText.length - (to - from)
            if (currentLen + insertLen > maxLength) {
              // Truncate pasted text to fit
              const allowed = maxLength - currentLen + (to - from)
              if (allowed <= 0) return true
              const truncated = clipboardText.slice(0, allowed)
              view.dispatch(view.state.tr.insertText(truncated, from, to))
              return true
            }
            return false
          }
        : undefined,
    },
    onUpdate: ({ editor }) => {
      const text = editor.state.doc.textContent
      setCharCount(text.length)
      onChange?.(editor.getHTML())
      forceToolbarUpdate()
    },
    onSelectionUpdate: () => {
      forceToolbarUpdate()
    },
    onTransaction: () => {
      forceToolbarUpdate()
    },
  })

  if (!editor) return null

  const isOverLimit = maxLength ? charCount >= maxLength : false

  return (
    <div className={cn(className)}>
      <div className="flex items-baseline justify-between mb-3">
        <label className="text-[18px] font-headline font-semibold text-on-surface">
          {label}
          {isRequired && <span className="text-primary/50 ml-1">*</span>}
        </label>
        {maxLength && charCount > 0 && (
          <span className={cn(
            "text-[12px]",
            isOverLimit ? "text-red-400" : "text-on-surface/20"
          )}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      <div className={cn(
        "bg-surface-container-lowest rounded-2xl border overflow-hidden",
        error ? "border-red-500/60" : "border-outline-variant/10"
      )}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-outline-variant/8">
          <button
            type="button"
            title="Heading"
            onMouseDown={(e) => {
              e.preventDefault()
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-[15px] font-bold",
              editor.isActive("heading", { level: 1 })
                ? "text-primary bg-primary/8"
                : "text-on-surface/40 hover:text-on-surface/70 hover:bg-surface-container"
            )}
          >
            H
          </button>
          <div className="w-px h-4 bg-outline-variant/12 mx-1" />
          <ToolbarButton
            icon="format_bold"
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            icon="format_italic"
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
          <div className="w-px h-4 bg-outline-variant/12 mx-1" />
          <ToolbarButton
            icon="format_list_bulleted"
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            icon="format_list_numbered"
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
        </div>

        {/* Editor */}
        <div className="px-4 py-2 min-h-[56px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
