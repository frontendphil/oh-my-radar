import { ReactNode } from "react"

type Props = { children: ReactNode }

export const FormGroup = ({ children }: Props) => (
  <div className="grid grid-cols-2 gap-4">{children}</div>
)
