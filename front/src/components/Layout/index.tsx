import { ReactNode } from "react"
import { SideMenu } from "./sidemenu"
import { Topbar } from "./topbar"

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SideMenu />
      <div className="flex flex-col flex-1 w-full">
        <Topbar />
        <main className="h-full overflow-y-auto">
          <div className="container px-6 mx-auto grid">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}