import { HTMLAttributes, useState } from "react"
import { v4 } from "uuid"

type InputProps = Omit<HTMLAttributes<HTMLInputElement>, "onChange"> & {
  type?: string
  label: string
  value?: string
  onChange?: (newValue: string) => void
}

export const Input = ({ label, value, onChange, ...rest }: InputProps) => {
  const [id] = useState(v4)

  return (
    <>
      <label
        htmlFor={id}
        className="uppercase text-sm font-bold block text-slate-500"
      >
        {label}
      </label>
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
    </>
  )
}
