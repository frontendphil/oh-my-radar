import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const Hint = ({ children }: Props) => (
  <div className="flex justify-center p-12 italic opacity-50">{children}</div>
)
