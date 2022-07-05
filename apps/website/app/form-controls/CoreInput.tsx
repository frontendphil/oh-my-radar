import { useTransition } from "@remix-run/react"
import { InputHTMLAttributes } from "react"

type Props = InputHTMLAttributes<HTMLInputElement>

export const CoreInput = ({ className, disabled, ...rest }: Props) => {
  const transition = useTransition()

  return (
    <input
      type="text"
      disabled={disabled || transition.state === "submitting"}
      {...rest}
      className={`${className} rounded border-b bg-zinc-500 bg-opacity-10 px-2 py-2 outline-none transition-all focus:border-purple-500 disabled:rounded-none disabled:bg-transparent disabled:px-0 dark:border-zinc-400  dark:text-white dark:focus:border-yellow-400`}
    />
  )
}
