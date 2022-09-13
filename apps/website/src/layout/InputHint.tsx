import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement>

export const InputHint = ({ children, className, ...rest }: Props) => (
  <div
    {...rest}
    className={`${className} mt-1 text-sm text-gray-500 dark:text-gray-400`}
  >
    {children}
  </div>
)
