import { HTMLAttributes } from "react"
import { Hint } from "./Hint"

export const Error = (props: HTMLAttributes<HTMLDivElement>) => (
  <Hint {...props} className="text-red-500" />
)
