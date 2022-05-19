import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const SidePanel = ({ children }: Props) => (
  <div className="sticky mt-12 h-full max-h-full overflow-y-auto border-t-2 border-slate-200 bg-slate-100 py-6 px-6 dark:border-slate-700 dark:bg-transparent md:mt-0 md:w-1/3 md:border-l-2 md:border-t-0 md:py-12">
    {children}
  </div>
)
