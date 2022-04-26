import { ColorSelect } from "../../form-controls"
import { List, ListItem } from "../../layout"
import { Participant } from "../../radar-chart"

type Props = {
  participants: Participant[]
  onChange: (participant: Participant) => void
}

export const Participants = ({ participants, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {participants.length > 0 && (
        <List>
          {participants.map(({ id, name, color }) => (
            <ListItem key={id} aria-label={name}>
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
    </div>
  )
}
