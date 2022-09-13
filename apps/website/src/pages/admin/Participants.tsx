import { Hint } from "../../layout"
import { AdminGetChartQuery } from "./api"

type Props = {
  participants: NonNullable<AdminGetChartQuery["charts_by_pk"]>["participants"]
}

export const Participants = ({ participants }: Props) => {
  if (participants.length === 0) {
    return <Hint>No participants, yet.</Hint>
  }

  return (
    <ul aria-label="Participants">
      {participants.map(({ id, name }) => (
        <li key={id} aria-label={name}>
          {name}
        </li>
      ))}
    </ul>
  )
}
