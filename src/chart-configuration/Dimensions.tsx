import { useState } from "react"
import { v4 } from "uuid"
import { Button, InputWithButton } from "../form-controls"
import { List, ListItem } from "../layout"
import { DimensionDescriptor } from "../radar-chart"

type Props = {
  dimensionDescriptors: DimensionDescriptor[]

  onAdd: (dimensionDescriptor: DimensionDescriptor) => void
  onRemove: (dimensionDescriptorId: string) => void
}

export const Dimensions = ({
  dimensionDescriptors,
  onAdd,
  onRemove,
}: Props) => {
  const [newDimension, setNewDimension] = useState("")

  return (
    <div className="flex flex-col gap-2">
      {dimensionDescriptors.length > 0 && (
        <List aria-label="Dimensions" className="flex flex-col gap-1">
          {dimensionDescriptors.map(({ id, title }) => (
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

          const isDuplicate = dimensionDescriptors.some(
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
            dimensionDescriptors.some(({ title }) => title === newDimension)
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
