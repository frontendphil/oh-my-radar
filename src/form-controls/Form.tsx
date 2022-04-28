import { ReactNode } from "react"

type Props = { children: ReactNode }

export const Form = ({ children }: Props) => (
  <form className="flex flex-col gap-4">{children}</form>
)
