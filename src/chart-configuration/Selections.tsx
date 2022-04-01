import { useState } from "react"
import { v4 } from "uuid"
import { Colors } from "../configuration"

import { Button, ColorSelect, Input } from "../form-controls"
import { List, ListItem } from "../layout"
import { SelectionDescriptor } from "../radar-chart"

type Props = {
  selectionDescriptors: SelectionDescriptor[]
  activeSelectionId: string
  onAdd: (selectionDescriptor: SelectionDescriptor) => void
  onChange: (SelectionDescriptor: SelectionDescriptor) => void
  onActivate: (selectionId: string) => void
}

export const Selections = ({
  selectionDescriptors,
  activeSelectionId,
  onAdd,
  onChange,
  onActivate,
}: Props) => {
  const [newSelection, setNewSelection] = useState("")

  return (
    <div className="flex flex-col gap-2">
      {selectionDescriptors.length > 0 && (
        <List>
          {selectionDescriptors.map(({ id, title, color }) => (
            <ListItem
              key={id}
              aria-label={title}
              action={
                <Button
                  disabled={activeSelectionId === id}
                  aria-label={`Activate "${title}"`}
                  onClick={() => onActivate(id)}
                >
                  Activate
                </Button>
              }
            >
              <div className="flex items-center gap-4">
                <ColorSelect
                  label={`Color for "${title}"`}
                  value={color}
                  onChange={(color) => onChange({ id, title, color })}
                />

                {title}
              </div>
            </ListItem>
          ))}
        </List>
      )}

      <Input
        label="Add a selection"
        value={newSelection}
        onChange={setNewSelection}
        onKeyUp={(event) => {
          if (event.key !== "Enter") {
            return
          }

          onAdd({ id: v4(), title: newSelection, color: Colors.pink })

          setNewSelection("")
        }}
      />
    </div>
  )
}
