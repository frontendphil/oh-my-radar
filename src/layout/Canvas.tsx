import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const Canvas = ({ children }: Props) => (
  <div className="flex flex-1 items-center justify-center bg-white dark:bg-gray-800">
    {children}
  </div>
)
