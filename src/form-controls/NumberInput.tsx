import invariant from "invariant"
import { HTMLAttributes, useEffect, useId, useState } from "react"
import { InputLayout } from "../layout"
import { CoreInput } from "./CoreInput"
import { Label } from "./Label"

type Props = Omit<HTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string
  value?: number
  onChange?: (value: number) => void
  isValid?: (
    value: number
  ) => [valid: true] | [valid: false, description: string]
}

export const NumberInput = ({
  label,
  value,
  onChange,
  isValid = () => [true],
  ...rest
}: Props) => {
  const id = useId()
  const errorId = useId()
  const [internalValue, setInternalValue] = useState(value?.toString())
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    setInternalValue(value?.toString())
  }, [value])

  return (
    <InputLayout>
      <Label htmlFor={id}>{label}</Label>

      <CoreInput
        {...rest}
        type="number"
        id={id}
        aria-describedby={errorId}
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

          const [valid, description] = isValid(event.target.valueAsNumber)

          if (valid) {
            setError(undefined)
            onChange(event.target.valueAsNumber)
          } else {
            setError(description)
          }
        }}
      />

      {error && <Error id={errorId}>{error}</Error>}
    </InputLayout>
  )
}

type ErrorProps = HTMLAttributes<HTMLDivElement>

const Error = ({ children, ...rest }: ErrorProps) => (
  <div {...rest} className="ml-2 mt-1 text-sm text-red-500">
    {children}
  </div>
)
