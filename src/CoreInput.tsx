import { HTMLAttributes } from "react"

export type CoreInputProps = Omit<
  HTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  type?: string
  value?: string
  onChange?: (newValue: string) => void
}

export const CoreInput = ({ id, value, onChange, ...rest }: CoreInputProps) => (
  <input
    type="text"
    {...rest}
    className="border border-slate-400 rounded px-2 py-2"
    id={id}
    value={value}
    onChange={(event) => {
      if (!onChange) {
        return
      }

      onChange(event.target.value)
    }}
  />
)
