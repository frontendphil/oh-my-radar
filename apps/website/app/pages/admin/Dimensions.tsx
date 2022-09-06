import { useId, useState } from "react"
import { TrashIcon } from "@heroicons/react/outline"
import { Button, IconButton, InputWithButton } from "../../form-controls"
import { Label } from "../../form-controls/Label"
import { List, ListItem } from "../../layout"
import { Dimension } from "@radar/chart"
import { Form, useActionData, useTransition } from "@remix-run/react"

export type NewDimension = Omit<Dimension, "id">

type Props = {
  dimensions: Dimension[]
}

export const Dimensions = ({ dimensions }: Props) => {
  const [newDimension, setNewDimension] = useState("")
  const listId = useId()

  const disableInsert =
    newDimension.trim() === "" ||
    dimensions.some(({ title }) => title === newDimension)

  return (
    <div className="flex flex-col gap-4">
      <Label htmlFor={listId}>Dimensions</Label>

      {dimensions.length > 0 && (
        <List id={listId} className="flex flex-col gap-1">
          {dimensions.map(({ id, title, deleted }) => (
            <Form key={id} method="post">
              <input type="hidden" name="dimensionId" value={id} />
              <ListItem
                aria-label={title}
                dirty={id === "new"}
                deleted={deleted}
                action={
                  <IconButton
                    name="action"
                    value="remove-dimension"
                    type="submit"
                    disabled={id === "new" || deleted}
                    aria-label={`Remove dimension "${title}"`}
                    icon={TrashIcon}
                  />
                }
              >
                {title}
              </ListItem>
            </Form>
          ))}
        </List>
      )}

      <Form method="post" onSubmit={() => setNewDimension("")}>
        <InputWithButton
          label="Add dimension"
          name="title"
          value={newDimension}
          placeholder="Dimension label"
          onChange={setNewDimension}
        >
          <Button
            name="action"
            value="add-dimension"
            type="submit"
            disabled={disableInsert}
            aria-label={`Add dimension "${newDimension}"`}
          >
            Add
          </Button>
        </InputWithButton>
      </Form>
    </div>
  )
}
