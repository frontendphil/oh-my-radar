import { HTMLAttributes, useState } from "react"
import { InputWithButton } from "./InputWithButton"

type Props = {
  dimensions: string[]

  onAdd: (dimension: string) => void
  onRemove: (dimension: string) => void
}

export const Dimensions = ({ dimensions, onAdd, onRemove }: Props) => {
  const [newDimension, setNewDimension] = useState("")

  return (
    <div className="flex flex-col gap-2">
      {dimensions.length > 0 && (
        <ul aria-label="Dimensions" className="flex flex-col gap-1">
          {dimensions.map((dimension) => (
            <li
              key={dimension}
              aria-label={dimension}
              className="flex items-center justify-between rounded border border-slate-300"
            >
              <span className="px-4">{dimension}</span>

              <Button
                aria-label={`Remove dimension "${dimension}"`}
                onClick={() => onRemove(dimension)}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      <InputWithButton
        label="Add dimension"
        value={newDimension}
        onChange={setNewDimension}
        onKeyUp={(event) => {
          if (event.key !== "Enter") {
            return
          }

          if (newDimension.trim() === "") {
            return
          }

          if (dimensions.includes(newDimension)) {
            return
          }

          onAdd(newDimension)
          setNewDimension("")
        }}
      >
        <Button
          disabled={
            newDimension.trim() === "" || dimensions.includes(newDimension)
          }
          aria-label={`Add dimension "${newDimension}"`}
          onClick={() => {
            onAdd(newDimension)
            setNewDimension("")
          }}
        >
          Add
        </Button>
      </InputWithButton>
    </div>
  )
}

type ButtonProps = HTMLAttributes<HTMLButtonElement> & {
  disabled?: boolean
}

const Button = (props: ButtonProps) => (
  <button
    {...props}
    className="disabled::bg-slate-100 rounded bg-slate-200 py-2 px-3 text-slate-800 disabled:text-slate-500"
  />
)
