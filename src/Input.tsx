import { CoreInput, CoreInputProps } from "./CoreInput"

import { Label } from "./Label"
import { useId } from "./useId"

type Props = CoreInputProps & {
  label: string
}

export const Input = ({ label, ...rest }: Props) => {
  const id = useId()

  return (
    <div className="flex flex-col">
      <Label htmlFor={id}>{label}</Label>

      <CoreInput {...rest} id={id} />
    </div>
  )
}
