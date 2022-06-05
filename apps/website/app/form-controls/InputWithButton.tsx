import invariant from "invariant"
import { HTMLAttributes, ReactNode, useId } from "react"
import { InputLayout } from "../layout"
import { CoreInput } from "./CoreInput"
import { Label } from "./Label"

type Props = Omit<HTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string
  children: ReactNode
  value?: string
  onChange?: (value: string) => void
}

export const InputWithButton = ({
  label,
  children,
  onChange,
  ...rest
}: Props) => {
  const id = useId()

  return (
    <InputLayout label={<Label htmlFor={id}>{label}</Label>}>
      <div className="flex gap-2">
        <CoreInput
          {...rest}
          id={id}
          className="flex-1"
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
        {children}
      </div>
    </InputLayout>
  )
}
