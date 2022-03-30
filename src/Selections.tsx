import { useState } from "react"
import { Button, Input } from "./form-controls"

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
        <ul>
          {selections.map((selection) => (
            <li key={selection} aria-label={selection}>
              {selection}

              <Button
                disabled={activeSelection === selection}
                onClick={() => onActivate(selection)}
              >
                Activate &quot;{selection}&quot;
              </Button>
            </li>
          ))}
        </ul>
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
