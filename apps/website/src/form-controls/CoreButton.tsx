import { AllHTMLAttributes } from "react"

export type ButtonProps = Omit<AllHTMLAttributes<HTMLButtonElement>, "type">

export const CoreButton = ({ children, className, ...rest }: ButtonProps) => (
  <button
    {...rest}
    className={`rounded bg-gradient-to-r py-2 px-3 outline-none ring-0 transition-all focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-500 disabled:opacity-75 ${className}`}
  >
    {children}
  </button>
)
