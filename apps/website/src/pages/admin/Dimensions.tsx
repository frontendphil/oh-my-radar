import { useEffect, useId, useState } from "react"
import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Button, IconButton, InputWithButton } from "../../form-controls"
import { Label } from "../../form-controls/Label"
import { List, ListItem } from "../../layout"
import { Dimension as ChartDimension } from "@radar/chart"

export type NewDimension = Omit<ChartDimension, "id">

type Props = {
  dimensions: ChartDimension[]
  disabled?: boolean
  onAdd: (dimension: NewDimension) => void
  onRemove: (dimensionId: string) => void
  onChange: (dimension: ChartDimension) => void
}

export const Dimensions = ({
  dimensions,
  disabled,
  onAdd,
  onRemove,
  onChange,
}: Props) => {
  const [newDimension, setNewDimension] = useState("")
  const listId = useId()

  return (
    <div className="flex flex-col gap-4">
      <Label id={listId}>Dimensions</Label>

      {dimensions.length > 0 && (
        <List aria-labelledby={listId} className="flex flex-col gap-1">
          {dimensions.map((dimension) => (
            <Dimension
              key={dimension.id}
              disabled={disabled}
              dimension={dimension}
              onRemove={() => onRemove(dimension.id)}
              onChange={(title) => onChange({ ...dimension, title })}
            />
          ))}
        </List>
      )}

      <InputWithButton
        label="Add dimension"
        value={newDimension}
        placeholder="Dimension label"
        disabled={disabled}
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
            disabled ||
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

type DimensionProps = {
  dimension: ChartDimension
  disabled?: boolean
  onRemove: () => void
  onChange: (title: string) => void
}

const Dimension = ({
  dimension,
  disabled,
  onRemove,
  onChange,
}: DimensionProps) => {
  const { title, id, deleted } = dimension

  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(title)

  useEffect(() => setValue(title), [title])

  if (editing) {
    return (
      <InputWithButton
        label="Dimension label"
        value={value}
        onChange={setValue}
      >
        <IconButton
          icon={CheckIcon}
          aria-label="Accept"
          onClick={() => {
            setEditing(false)
            onChange(value)
          }}
        />
      </InputWithButton>
    )
  }

  return (
    <ListItem
      aria-label={title}
      dirty={id === "new"}
      deleted={deleted}
      action={
        <div className="flex gap-2">
          <IconButton
            disabled={disabled}
            aria-label="Edit"
            onClick={() => setEditing(!editing)}
            icon={PencilIcon}
          />

          <IconButton
            disabled={id === "new" || disabled}
            aria-label={`Remove dimension "${title}"`}
            onClick={() => onRemove()}
            icon={TrashIcon}
          />
        </div>
      }
    >
      {title}
    </ListItem>
  )
}
