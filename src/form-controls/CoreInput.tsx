import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLInputElement> & {
  type?: string
  value?: string
}

export const CoreInput = ({ className, ...rest }: Props) => (
  <input
    type="text"
    {...rest}
    className={`${className} rounded border-b bg-slate-500 bg-opacity-10 px-2 py-2 outline-none transition-all focus:border-purple-500 disabled:rounded-none disabled:bg-transparent disabled:px-0 dark:border-slate-400  dark:text-white dark:focus:border-yellow-400`}
  />
)
