import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLInputElement> & {
  type?: string
  value?: string
}

export const CoreInput = (props: Props) => (
  <input
    type="text"
    {...props}
    className="rounded border border-slate-400 px-2 py-2"
  />
)
