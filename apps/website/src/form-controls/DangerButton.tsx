import { ButtonProps, CoreButton } from "./CoreButton"

export const DangerButton = (props: ButtonProps) => (
  <CoreButton
    {...props}
    className="from-red-600 to-red-500 text-white ring-0 focus:ring-2 focus:ring-red-300 focus:ring-offset-red-900"
  />
)
