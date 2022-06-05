import { ButtonHTMLAttributes, HTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean
}

export const PrimaryButton = (props: ButtonProps) => (
  <button
    {...props}
    className="rounded bg-gradient-to-r  from-purple-600 to-purple-500 py-2 px-3 text-white shadow-lg ring-0 hover:shadow-2xl  hover:shadow-purple-700 focus:ring-2 focus:ring-purple-300 focus-visible:ring-purple-300 disabled:opacity-75"
  />
)
