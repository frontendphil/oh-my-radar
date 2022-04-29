import invariant from "invariant"
import { AllHTMLAttributes, useId } from "react"
import { InputLayout } from "../layout"
import { CoreInput } from "./CoreInput"
import { Hint } from "./Hint"

import { Label } from "./Label"

type Props = Omit<AllHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string
  value?: string
  hint?: string
  onChange?: (value: string) => void
}

export const Input = ({ label, hint, onChange, ...rest }: Props) => {
  const id = useId()
  const hintId = useId()

  return (
    <InputLayout label={<Label htmlFor={id}>{label}</Label>}>
      <CoreInput
        {...rest}
        id={id}
        aria-describedby={hintId}
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

      {hint && <Hint id={hintId}>{hint}</Hint>}
    </InputLayout>
  )
}
