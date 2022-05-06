import { useId } from "react"
import { Color, Label } from "../../form-controls"
import { InputLayout, List, ListItem } from "../../layout"
import { Participant } from "../../radar-chart"

type Props = {
  participants: Participant[]
}

export const Participants = ({ participants }: Props) => {
  const id = useId()

  return (
    <InputLayout label={<Label htmlFor={id}>Participants</Label>}>
      <List id={id}>
        {participants.map(({ id, name, color }) => (
          <ListItem key={id} aria-label={name}>
            <Participant name={name} color={color} />
          </ListItem>
        ))}
      </List>
    </InputLayout>
  )
}

const Participant = ({ color, name }: Pick<Participant, "color" | "name">) => {
  const id = useId()

  return (
    <div className="flex items-center gap-4">
      <input defaultChecked id={id} type="checkbox" />

      <Color color={color} />

      <label htmlFor={id}>{name}</label>
    </div>
  )
}
