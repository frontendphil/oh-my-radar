import { useTransition } from "@remix-run/react"
import { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export const CoreButton = ({ disabled, ...rest }: Props) => {
  const transition = useTransition()

  return (
    <button
      disabled={disabled || transition.state === "submitting"}
      {...rest}
    />
  )
}
