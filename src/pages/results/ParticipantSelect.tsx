import { useId } from "react"
import { Color, Label } from "../../form-controls"
import { Hint, InputLayout, List, ListItem } from "../../layout"
import { Participant } from "../../radar-chart"

type Props = {
  participants: Participant[]
  value: string[]
  onChange: (value: string[]) => void
}

export const ParticipantSelect = ({ participants, value, onChange }: Props) => {
  const id = useId()

  if (participants.length === 0) {
    return <Hint>No submissions yet</Hint>
  }

  return (
    <InputLayout label={<Label htmlFor={id}>Participants</Label>}>
      <List id={id}>
        {participants.map(({ id, name, color }) => (
          <ListItem key={id} aria-label={name}>
            <Participant
              name={name}
              color={color}
              checked={value.includes(id)}
              onChange={(checked) => {
                if (checked) {
                  onChange([...value, id])
                } else {
                  onChange(value.filter((item) => item !== id))
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </InputLayout>
  )
}

type ParticipantProps = Pick<Participant, "color" | "name"> & {
  checked: boolean
  onChange: (checked: boolean) => void
}

const Participant = ({ color, name, checked, onChange }: ParticipantProps) => {
  const id = useId()

  return (
    <div className="flex items-center ">
      <input
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        id={id}
        className="mr-4"
        type="checkbox"
      />

      <Color color={color} />

      <label className="ml-2" htmlFor={id}>
        {name}
      </label>
    </div>
  )
}
