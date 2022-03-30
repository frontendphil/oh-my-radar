import { useState } from "react"
import { Button, Input } from "./form-controls"
import { List, ListItem } from "./layout"

type Props = {
  selections: string[]
  activeSelection: string
  onAdd: (selection: string) => void
  onActivate: (selection: string) => void
}

export const Selections = ({
  selections,
  activeSelection,
  onAdd,
  onActivate,
}: Props) => {
  const [newSelection, setNewSelection] = useState("")

  return (
    <div className="flex flex-col gap-2">
      {selections.length > 0 && (
        <List>
          {selections.map((selection) => (
            <ListItem
              key={selection}
              aria-label={selection}
              action={
                <Button
                  disabled={activeSelection === selection}
                  aria-label={`Activate "${selection}"`}
                  onClick={() => onActivate(selection)}
                >
                  Activate
                </Button>
              }
            >
              {selection}
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

          onAdd(newSelection)

          setNewSelection("")
        }}
      />
    </div>
  )
}
