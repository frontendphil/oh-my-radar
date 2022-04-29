import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLDivElement>

export const Hint = ({ children, className, ...rest }: Props) => (
  <div
    {...rest}
    className={`${className} ml-2 mt-1 w-2/3 text-sm text-gray-300`}
  >
    {children}
  </div>
)
