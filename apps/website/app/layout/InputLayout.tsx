import { ReactNode } from "react"

type Props = {
  children: ReactNode
  label: ReactNode
}

export const InputLayout = ({ children, label }: Props) => (
  <div className="flex flex-col gap-2">
    {label}

    <div className="flex flex-col">{children}</div>
  </div>
)
