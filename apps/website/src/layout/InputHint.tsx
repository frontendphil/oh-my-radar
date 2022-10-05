import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement>

export const InputHint = ({ children, className, ...rest }: Props) => (
  <div
    {...rest}
    className={`text-gray-500 dark:text-gray-400 ${className} mt-1 text-sm `}
  >
    {children}
  </div>
)
