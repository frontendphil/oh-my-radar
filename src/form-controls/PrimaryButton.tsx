import { HTMLAttributes } from "react"

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean
}

export const PrimaryButton = (props: ButtonProps) => (
  <button
    {...props}
    className="rounded bg-teal-500 py-2 px-3 text-white shadow-lg disabled:opacity-75"
  />
)
