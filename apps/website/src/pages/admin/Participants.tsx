import { useId } from "react"
import { Hint } from "../../layout"
import { ItemType } from "../test-utils"
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
      {participants.map((participant) => (
        <Participant key={participant.id} participant={participant} />
      ))}
    </ul>
  )
}

type ParticipantProps = {
  participant: ItemType<Props["participants"]>
}

const Participant = ({ participant }: ParticipantProps) => {
  const descriptionId = useId()

  return (
    <li aria-label={participant.name} aria-describedby={descriptionId}>
      {participant.name}
      <span id={descriptionId} aria-hidden>
        Submitted on {formatter.format(new Date(participant.createdAt))}
      </span>
    </li>
  )
}

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
})
