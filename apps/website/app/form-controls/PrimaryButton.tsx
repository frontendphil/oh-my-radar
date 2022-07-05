import { ButtonHTMLAttributes } from "react"
import { CoreButton } from "./CoreButton"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const PrimaryButton = ({ disabled, ...rest }: ButtonProps) => (
  <CoreButton
    {...rest}
    className="rounded bg-gradient-to-r  from-purple-600 to-purple-500 py-2 px-3 text-white shadow-lg ring-0 hover:shadow-2xl  hover:shadow-purple-700 focus:ring-2 focus:ring-purple-300 focus-visible:ring-purple-300 disabled:opacity-75"
  />
)
