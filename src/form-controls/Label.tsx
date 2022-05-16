import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLLabelElement> & {
  htmlFor: string
}

export const Label = (props: Props) => (
  <label
    {...props}
    className="flex text-xs  font-bold uppercase text-slate-500 dark:text-yellow-400"
  />
)
