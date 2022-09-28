import { ButtonProps, CoreButton } from "./CoreButton"

export const PrimaryButton = (props: ButtonProps) => (
  <CoreButton
    {...props}
    className="from-purple-600 to-purple-500 text-white shadow-lg ring-0 hover:shadow-2xl  hover:shadow-purple-700 focus:ring-2 focus:ring-purple-300 focus-visible:ring-purple-300"
  />
)
