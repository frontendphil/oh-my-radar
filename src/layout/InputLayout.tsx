import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const InputLayout = ({ children }: Props) => (
  <div className="flex flex-col gap-2">{children}</div>
)
