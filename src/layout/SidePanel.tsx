import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const SidePanel = ({ children }: Props) => (
  <div className="sticky h-full w-1/3 border-l-2 border-slate-700 p-12">
    {children}
  </div>
)
