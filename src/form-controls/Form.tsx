import { ReactNode } from "react"

type Props = { children: ReactNode }

export const Form = ({ children }: Props) => (
  <div className="flex flex-col gap-8">{children}</div>
)
