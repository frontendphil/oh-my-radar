import { HTMLAttributes, ReactNode } from "react"

type Props = HTMLAttributes<HTMLLIElement> & {
  children: ReactNode
  action?: ReactNode
}

export const ListItem = ({ children, action, ...rest }: Props) => (
  <li
    {...rest}
    className="flex items-center justify-between border-b border-slate-600 py-2 pr-2"
  >
    <span className="px-4">{children}</span>

    {action}
  </li>
)
