import { HTMLAttributes, ReactNode } from "react"

type Props = HTMLAttributes<HTMLUListElement> & {
  children: ReactNode
}

export const List = ({ children, ...rest }: Props) => (
  <ul {...rest} className="flex flex-col gap-1">
    {children}
  </ul>
)
