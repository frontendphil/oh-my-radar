import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const Canvas = ({ children }: Props) => (
  <div className="flex h-2/3 justify-center bg-white pt-6 dark:bg-zinc-900 md:h-full md:flex-1 md:items-center md:pt-0 ">
    {children}
  </div>
)
