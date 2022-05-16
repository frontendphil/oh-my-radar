import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const View = ({ children }: Props) => (
  <div className="flex h-full max-h-full justify-between overflow-hidden">
    {children}
  </div>
)
