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
    className={`${className} flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold uppercase transition-all hover:bg-yellow-300 hover:text-yellow-900 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white dark:hover:bg-yellow-500`}
  >
    <Icon className="h-4 w-4" />
  </button>
)
