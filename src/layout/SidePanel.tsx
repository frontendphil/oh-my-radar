import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const SidePanel = ({ children }: Props) => (
  <div className="sticky h-full max-h-full w-1/3 overflow-y-auto border-l-2 border-slate-200 bg-slate-100 py-12 px-6 dark:border-slate-700 dark:bg-transparent">
    {children}
  </div>
)
