import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLLabelElement> & {
  htmlFor: string
}

export const Label = (props: Props) => (
  <label
    {...props}
    className="flex bg-gradient-to-r from-yellow-400 to-yellow-800 bg-clip-text text-sm font-bold uppercase text-transparent text-slate-500"
  />
)
