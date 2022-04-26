import { useState } from "react"
import { v4 } from "uuid"
import { Button, ColorSelect, Input } from "../../form-controls"
import { List, ListItem } from "../../layout"
import { Colors, Participant } from "../../radar-chart"

type Props = {
  participants: Participant[]
  activeParticipantId?: string
  onAdd: (participant: Participant) => void
  onChange: (participant: Participant) => void
  onActivate?: (selectionId: string) => void
}

export const Participants = ({
  participants,
  activeParticipantId,
  onAdd,
  onChange,
  onActivate,
}: Props) => {
  const [participantName, setParticipantName] = useState("")

  return (
    <div className="flex flex-col gap-2">
      {participants.length > 0 && (
        <List>
          {participants.map(({ id, name, color }) => (
            <ListItem
              key={id}
              aria-label={name}
              action={
                <Button
                  disabled={activeParticipantId === id}
                  aria-label={`Activate "${name}"`}
                  onClick={() => {
                    if (!onActivate) {
                      return
                    }
                    onActivate(id)
                  }}
                >
                  Activate
                </Button>
              }
            >
              <div className="flex items-center gap-4">
                <ColorSelect
                  label={`Color for "${name}"`}
                  value={color}
                  onChange={(color) => onChange({ id, name, color })}
                />

                {name}
              </div>
            </ListItem>
          ))}
        </List>
      )}

      <Input
        label="Add a selection"
        value={participantName}
        onChange={setParticipantName}
        onKeyUp={(event) => {
          if (event.key !== "Enter") {
            return
          }

          onAdd({ id: v4(), name: participantName, color: Colors.pink })

          setParticipantName("")
        }}
      />
    </div>
  )
}
