import { ButtonHTMLAttributes, ComponentType, HTMLAttributes } from "react"
import { CoreButton } from "./CoreButton"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ComponentType<HTMLAttributes<SVGElement>>
}

export const IconButton = ({ icon: Icon, className, ...rest }: Props) => (
  <CoreButton
    {...rest}
    className={`${className} rounded-full p-2 text-xs font-bold uppercase transition-all hover:bg-yellow-300 hover:text-yellow-900 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white dark:hover:bg-yellow-500`}
  >
    <Icon className="h-4 w-4" />
  </CoreButton>
)
