import { HTMLAttributes } from "react"
import { InputHint } from "../layout"

export const Error = (props: HTMLAttributes<HTMLDivElement>) => (
  <InputHint {...props} className="text-red-500" />
)
