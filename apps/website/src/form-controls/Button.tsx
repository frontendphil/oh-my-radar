import { ButtonProps, CoreButton } from "./CoreButton"

export const Button = (props: ButtonProps) => (
  <CoreButton
    {...props}
    className="from-purple-600 to-purple-500 text-white ring-0 focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:ring-offset-purple-900"
  />
)
