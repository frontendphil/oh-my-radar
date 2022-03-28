import { useState } from "react"
import { Input } from "./Input"

type Props = {
  dimensions: string[]

  onAdd: (dimension: string) => void
  onRemove: (dimension: string) => void
}

export const Dimensions = ({ dimensions, onAdd, onRemove }: Props) => {
  const [newDimension, setNewDimension] = useState("")

  return (
    <>
      {dimensions.length > 0 && (
        <ul aria-label="Dimensions">
          {dimensions.map((dimension) => (
            <li aria-label={dimension} key={dimension}>
              {dimension}

              <button
                aria-label={`Remove dimension "${dimension}"`}
                onClick={() => onRemove(dimension)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <Input
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
      />

      <button
        disabled={
          newDimension.trim() === "" || dimensions.includes(newDimension)
        }
        onClick={() => {
          onAdd(newDimension)
          setNewDimension("")
        }}
      >{`Add dimension "${newDimension}"`}</button>
    </>
  )
}
