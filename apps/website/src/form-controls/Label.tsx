import { AllHTMLAttributes } from "react"

type Props = AllHTMLAttributes<HTMLLabelElement>

export const Label = (props: Props) => (
  <label
    {...props}
    className="flex text-xs  font-bold uppercase text-zinc-500 dark:text-zinc-400"
  />
)
