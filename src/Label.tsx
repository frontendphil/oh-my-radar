import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLLabelElement> & {
  htmlFor: string
}

export const Label = (props: Props) => (
  <label
    {...props}
    className="uppercase text-sm font-bold block text-slate-500"
  />
)
