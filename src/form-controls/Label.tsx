import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLLabelElement> & {
  htmlFor: string
}

export const Label = (props: Props) => (
  <label
    {...props}
    className="block text-sm font-bold uppercase text-slate-500"
  />
)
