import { Suspense } from "react"
import { DesktopSidebar } from "./desktop-sidebar"
import { MobileHeader } from "./mobile-header"
import { MobileNav } from "./mobile-nav"

interface AppShellProps {
  children: React.ReactNode
  rightSidebar?: React.ReactNode
}

export function AppShell({ children, rightSidebar }: AppShellProps) {
  return (
    <div className="flex min-h-dvh max-w-[1280px] mx-auto">
      <Suspense><DesktopSidebar /></Suspense>
      <div className="flex-1 flex flex-col min-w-0">
        <MobileHeader />
        <div className="flex flex-1">
          <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
          {rightSidebar && (
            <aside className="hidden xl:block w-80 p-6 space-y-6 h-screen sticky top-0 overflow-y-auto hide-scrollbar border-l border-outline-variant/10">
              {rightSidebar}
            </aside>
          )}
        </div>
        <MobileNav />
      </div>
    </div>
  )
}
