import { ReactNode } from "react"
import { CoreInput, CoreInputProps } from "./CoreInput"
import { Label } from "./Label"
import { useId } from "./useId"

type Props = CoreInputProps & {
  label: string
  children: ReactNode
}

export const InputWithButton = ({ label, children, ...rest }: Props) => {
  const id = useId()

  return (
    <div className="flex flex-col">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex gap-2">
        <CoreInput {...rest} id={id} />
        {children}
      </div>
    </div>
  )
}
