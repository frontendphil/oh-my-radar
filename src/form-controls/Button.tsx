import { HTMLAttributes } from "react"

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean
}

export const Button = (props: ButtonProps) => (
  <button
    {...props}
    className="disabled::bg-slate-100 rounded bg-slate-200 py-2 px-3 text-slate-800 disabled:text-slate-500"
  />
)
