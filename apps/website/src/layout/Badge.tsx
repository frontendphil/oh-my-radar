import { PropsWithChildren } from "react"

export const Badge = ({ children }: PropsWithChildren) => (
  <span
    aria-hidden
    className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-300 text-xs leading-none text-teal-900 dark:bg-yellow-500 dark:text-yellow-900"
  >
    {children}
  </span>
)
