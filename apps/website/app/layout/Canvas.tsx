import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const Canvas = ({ children }: Props) => (
  <div className="flex flex-1 items-center justify-center bg-white pt-12 dark:bg-zinc-900 md:pt-0">
    {children}
  </div>
)
