import { HTMLAttributes } from "react"

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean
}

export const Button = (props: ButtonProps) => (
  <button
    {...props}
    className="rounded bg-gradient-to-r from-purple-600 to-purple-500 py-2 px-3 text-white transition-all disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-75"
  />
)
