import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLInputElement> & {
  type?: string
  value?: string
}

export const CoreInput = ({ className, ...rest }: Props) => (
  <input
    type="text"
    {...rest}
    className={`${className} rounded border-b border-slate-400 bg-white bg-opacity-10 px-2 py-2 text-white outline-none transition-all focus:border-yellow-400 disabled:rounded-none disabled:bg-transparent disabled:px-0`}
  />
)
