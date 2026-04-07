import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
  hint?: string
}

export function FormInput({
  label,
  required,
  hint,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between">
        <label className="text-[18px] font-headline font-semibold text-on-surface">
          {label}
          {required && <span className="text-primary/60 ml-0.5">*</span>}
        </label>
        {hint && (
          <span className="text-[12px] text-secondary/40 italic">{hint}</span>
        )}
      </div>
      <input
        className="w-full bg-transparent border-b border-outline-variant/12 focus:border-primary/50 focus:ring-0 focus:outline-none py-3 text-[14px] font-body placeholder:text-on-surface/30 text-on-surface transition-colors"
        {...props}
      />
    </div>
  )
}
