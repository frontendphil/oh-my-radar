import { useState } from "react"
import { Button, InputWithButton } from "./form-controls"
import { List, ListItem } from "./layout"

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
        <List aria-label="Dimensions" className="flex flex-col gap-1">
          {dimensions.map((dimension) => (
            <ListItem
              key={dimension}
              aria-label={dimension}
              action={
                <Button
                  aria-label={`Remove dimension "${dimension}"`}
                  onClick={() => onRemove(dimension)}
                >
                  Remove
                </Button>
              }
            >
              {dimension}
            </ListItem>
          ))}
        </List>
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
