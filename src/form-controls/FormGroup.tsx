import { ReactNode } from "react"

type Props = { children: ReactNode }

export const FormGroup = ({ children }: Props) => (
  <div className="flex gap-4">{children}</div>
)
