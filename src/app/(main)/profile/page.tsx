"use client"

import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col items-center justify-center py-20">
        <span className="material-symbols-outlined text-[48px] text-primary/20 mb-4">person</span>
        <p className="text-[15px] text-on-surface/60 font-medium">
          此处链接 Cowork 完整个人主页
        </p>
        <Link href="/" className="text-[13px] text-primary mt-4 hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  )
}
