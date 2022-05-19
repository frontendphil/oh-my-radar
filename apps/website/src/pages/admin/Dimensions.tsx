import { useId, useState } from "react"
import { TrashIcon } from "@heroicons/react/outline"
import { Button, IconButton, InputWithButton } from "../../form-controls"
import { Label } from "../../form-controls/Label"
import { List, ListItem } from "../../layout"
import { Dimension } from "@radar/chart"

export type NewDimension = Omit<Dimension, "id">

type Props = {
  dimensions: Dimension[]

  onAdd: (dimension: NewDimension) => void
  onRemove: (dimensionId: string) => void
}

export const Dimensions = ({ dimensions, onAdd, onRemove }: Props) => {
  const [newDimension, setNewDimension] = useState("")
  const listId = useId()

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor={listId}>Dimensions</Label>

      {dimensions.length > 0 && (
        <List id={listId} className="flex flex-col gap-1">
          {dimensions.map(({ id, title, deleted }) => (
            <ListItem
              key={id}
              aria-label={title}
              dirty={id === "new"}
              deleted={deleted}
              action={
                <IconButton
                  disabled={id === "new" || deleted}
                  aria-label={`Remove dimension "${title}"`}
                  onClick={() => onRemove(id)}
                  icon={TrashIcon}
                />
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
        placeholder="Dimension label"
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

          onAdd({ title: newDimension })
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
            onAdd({ title: newDimension })
            setNewDimension("")
          }}
        >
          Add
        </Button>
      </InputWithButton>
    </div>
  )
}
