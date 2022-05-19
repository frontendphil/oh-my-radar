import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const View = ({ children }: Props) => (
  <div className="flex h-full flex-col justify-between overflow-hidden md:max-h-full md:flex-row">
    {children}
  </div>
)
