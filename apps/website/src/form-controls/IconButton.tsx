import { ComponentType, HTMLAttributes } from "react"
import { CoreButton } from "./CoreButton"

type Props = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean
  icon: ComponentType<HTMLAttributes<SVGElement>>
}

export const IconButton = ({
  icon: Icon,
  disabled,
  className,
  ...rest
}: Props) => (
  <CoreButton
    {...rest}
    disabled={disabled}
    className={`${className} flex h-10 w-10 items-center justify-center rounded-full to-transparent text-xs font-bold uppercase transition-all hover:bg-teal-300 hover:text-teal-900 focus:text-teal-900 disabled:from-transparent disabled:to-transparent disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white dark:hover:bg-yellow-500 dark:focus:bg-yellow-500 dark:focus:ring-yellow-500 dark:focus:ring-offset-yellow-900`}
  >
    <Icon className="h-4 w-4" />
  </CoreButton>
)
