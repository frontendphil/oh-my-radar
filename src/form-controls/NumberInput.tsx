import invariant from "invariant"
import { HTMLAttributes, useEffect, useState } from "react"
import { CoreInput } from "./CoreInput"
import { Label } from "./Label"
import { useId } from "./useId"

type Props = Omit<HTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string
  value?: number
  onChange?: (value: number) => void
}

export const NumberInput = ({ label, value, onChange, ...rest }: Props) => {
  const id = useId()
  const [internalValue, setInternalValue] = useState(value?.toString())

  useEffect(() => {
    setInternalValue(value?.toString())
  }, [value])

  return (
    <div className="flex flex-col">
      <Label htmlFor={id}>{label}</Label>

      <CoreInput
        {...rest}
        type="number"
        id={id}
        value={internalValue}
        onChange={(event) => {
          if (!onChange) {
            return
          }

          invariant(
            event.target instanceof HTMLInputElement,
            `Expected an input as event target.`
          )

          setInternalValue(event.target.value)

          if (isNaN(event.target.valueAsNumber)) {
            return
          }

          onChange(event.target.valueAsNumber)
        }}
      />
    </div>
  )
}
