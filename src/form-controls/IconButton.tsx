import { ComponentType, HTMLAttributes } from "react"

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
  <button
    {...rest}
    disabled={disabled}
    className={`${className} rounded-full p-2 text-xs font-bold uppercase transition-all hover:bg-yellow-300 hover:text-yellow-900 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white dark:hover:bg-yellow-500`}
  >
    <Icon className="h-4 w-4" />
  </button>
)
