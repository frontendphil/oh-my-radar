import invariant from "invariant"
import { AllHTMLAttributes, PropsWithChildren, ReactNode, useId } from "react"
import { InputLayout } from "../layout"
import { CoreInput } from "./CoreInput"
import { Label } from "./Label"

type Props = PropsWithChildren<
  Omit<AllHTMLAttributes<HTMLInputElement>, "onChange"> & {
    label: string
    hint?: string
    onChange?: (value: string) => void
  }
>

export const InputWithButton = ({
  label,
  children,
  hint,
  onChange,
  ...rest
}: Props) => {
  const id = useId()

  return (
    <InputLayout hint={hint} label={<Label htmlFor={id}>{label}</Label>}>
      {(hintId) => (
        <div className="flex gap-2">
          <CoreInput
            {...rest}
            id={id}
            className="flex-1"
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
          {children}
        </div>
      )}
    </InputLayout>
  )
}
