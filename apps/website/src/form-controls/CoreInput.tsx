import { AllHTMLAttributes } from "react"

type Props = AllHTMLAttributes<HTMLInputElement>

export const CoreInput = ({ className, ...rest }: Props) => (
  <input
    type="text"
    {...rest}
    className={`${className} rounded border-b bg-zinc-500 bg-opacity-10 px-2 py-2 outline-none transition-all focus:border-purple-500 disabled:rounded-none disabled:bg-transparent disabled:px-0 dark:border-zinc-400  dark:text-white dark:focus:border-yellow-400`}
  />
)
