import { ButtonHTMLAttributes } from "react"
import { CoreButton } from "./CoreButton"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) => (
  <CoreButton
    {...props}
    className="rounded bg-gradient-to-r from-purple-600 to-purple-500 py-2 px-3 text-white transition-all disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-75"
  />
)
