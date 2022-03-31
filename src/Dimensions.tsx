import { useState } from "react"
import { v4 } from "uuid"
import { Button, InputWithButton } from "./form-controls"
import { List, ListItem } from "./layout"
import { DimensionDescriptor } from "./radar-chart"

type Props = {
  dimensions: DimensionDescriptor[]

  onAdd: (dimension: DimensionDescriptor) => void
  onRemove: (dimensionId: string) => void
}

export const Dimensions = ({ dimensions, onAdd, onRemove }: Props) => {
  const [newDimension, setNewDimension] = useState("")

  return (
    <div className="flex flex-col gap-2">
      {dimensions.length > 0 && (
        <List aria-label="Dimensions" className="flex flex-col gap-1">
          {dimensions.map(({ id, title }) => (
            <ListItem
              key={id}
              aria-label={title}
              action={
                <Button
                  aria-label={`Remove dimension "${title}"`}
                  onClick={() => onRemove(id)}
                >
                  Remove
                </Button>
              }
            >
              {title}
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

          const isDuplicate = dimensions.some(
            ({ title }) => title === newDimension
          )

          if (isDuplicate) {
            return
          }

          onAdd({ id: v4(), title: newDimension })
          setNewDimension("")
        }}
      >
        <Button
          disabled={
            newDimension.trim() === "" ||
            dimensions.some(({ title }) => title === newDimension)
          }
          aria-label={`Add dimension "${newDimension}"`}
          onClick={() => {
            onAdd({ id: v4(), title: newDimension })
            setNewDimension("")
          }}
        >
          Add
        </Button>
      </InputWithButton>
    </div>
  )
}
