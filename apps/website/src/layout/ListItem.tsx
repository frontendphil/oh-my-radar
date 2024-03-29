import { HTMLAttributes, ReactNode } from "react"

type Props = HTMLAttributes<HTMLLIElement> & {
  children: ReactNode
  action?: ReactNode
  dirty?: boolean
  deleted?: boolean
}

export const ListItem = ({
  children,
  action,
  dirty,
  deleted,
  ...rest
}: Props) => (
  <li
    {...rest}
    className={`flex items-center justify-between border-b border-zinc-300 py-2 pr-2 dark:border-zinc-600`}
  >
    <span
      className={`pl-2 pr-4 transition-all ${dirty ? "opacity-50" : ""} ${
        deleted ? "line-through opacity-50" : ""
      }`}
    >
      {children}
    </span>

    {action}
  </li>
)
