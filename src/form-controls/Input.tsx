import invariant from "invariant"
import { AllHTMLAttributes, useId } from "react"
import { InputLayout } from "../layout"
import { CoreInput } from "./CoreInput"

import { Label } from "./Label"

type Props = Omit<AllHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string
  value?: string
  onChange?: (value: string) => void
}

export const Input = ({ label, onChange, ...rest }: Props) => {
  const id = useId()

  return (
    <InputLayout>
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
    </InputLayout>
  )
}
