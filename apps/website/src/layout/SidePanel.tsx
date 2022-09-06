import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const SidePanel = ({ children }: Props) => (
  <div className="sticky mt-12 h-full max-h-full overflow-y-auto border-t-2 border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-transparent md:mt-0 md:w-1/3 md:border-l-2 md:border-t-0 ">
    {children}
  </div>
)
