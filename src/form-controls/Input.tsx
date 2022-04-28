import invariant from "invariant"
import { HTMLAttributes, useId } from "react"
import { CoreInput } from "./CoreInput"

import { Label } from "./Label"

type Props = Omit<HTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string
  value?: string
  onChange?: (value: string) => void
}

export const Input = ({ label, onChange, ...rest }: Props) => {
  const id = useId()

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>

      <CoreInput
        {...rest}
        id={id}
        onChange={(event) => {
          if (!onChange) {
            return
          }

          invariant(
            event.target instanceof HTMLInputElement,
            `Expected an input as event target.`
          )

          onChange(event.target.value)
        }}
      />
    </div>
  )
}
