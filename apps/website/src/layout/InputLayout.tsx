import { ReactNode, useId } from "react"
import { InputHint } from "./InputHint"

type Props = {
  children: ReactNode | ((hintId: string) => ReactNode)
  label: ReactNode
  hint?: ReactNode
}

export const InputLayout = ({ children, label, hint }: Props) => {
  const hintId = useId()

  return (
    <div className="flex flex-col gap-2">
      {label}

      <div className="flex flex-col">
        {typeof children === "function" ? children(hintId) : children}
      </div>

      {hint && <InputHint id={hintId}>{hint}</InputHint>}
    </div>
  )
}
