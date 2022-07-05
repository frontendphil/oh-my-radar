import { ReactNode } from "react"
import { Form as RemixForm } from "@remix-run/react"

type Props = { children: ReactNode }

export const Form = ({ children }: Props) => (
  <RemixForm method="post" className="flex flex-col gap-8">
    {children}
  </RemixForm>
)
