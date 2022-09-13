import { gql, Reference } from "@apollo/client"
import { TrashIcon } from "@heroicons/react/24/outline"
import invariant from "invariant"
import { useId } from "react"
import { IconButton } from "../../form-controls"
import { Hint } from "../../layout"
import { ItemType } from "../test-utils"
import { AdminGetChartQuery, useDeleteParticipantMutation } from "./api"

type ApiChart = NonNullable<AdminGetChartQuery["charts_by_pk"]>

type ApiParticipant = ItemType<ApiChart["participants"]>

type Props = {
  participants: ApiParticipant[]
}

export const Participants = ({ participants }: Props) => {
  const descriptionId = useId()

  const [deleteParticipant] = useDeleteParticipantMutation({
    update: (cache, { data }) => {
      if (!data || !data.delete_participants_by_pk) {
        return
      }

      const { id } = data.delete_participants_by_pk

      cache.modify({
        fields: {
          charts_by_pk(chartRef: Reference, { readField, DELETE }) {
            const participantRefs = readField("participants", chartRef)

            invariant(
              Array.isArray(participantRefs),
              `Chart with id "${readField(
                "id",
                chartRef
              )}" does not specify "participants".`
            )

            const update = cache.writeFragment({
              id: chartRef.__ref,
              fragment: gql`
                fragment participants on charts {
                  participants {
                    id
                  }
                }
              `,
              data: {
                participants: participantRefs.filter(
                  (participantRef: Reference) =>
                    readField("id", participantRef) !== id
                ),
              },
            })

            return update
          },
        },
      })
    },
  })

  return (
    <>
      <ul
        aria-label="Participants"
        aria-describedby={participants.length === 0 ? descriptionId : undefined}
        className="flex flex-col gap-4"
      >
        {participants.map((participant) => (
          <Participant
            key={participant.id}
            participant={participant}
            onRemove={() =>
              deleteParticipant({ variables: { id: participant.id } })
            }
          />
        ))}
      </ul>

      {participants.length === 0 && (
        <Hint id={descriptionId}>No participants, yet.</Hint>
      )}
    </>
  )
}

type ParticipantProps = {
  participant: ApiParticipant
  onRemove: () => void
}

const Participant = ({ participant, onRemove }: ParticipantProps) => {
  const descriptionId = useId()

  return (
    <li
      aria-label={participant.name}
      aria-describedby={descriptionId}
      className="flex items-center justify-between"
    >
      <div className="flex flex-col ">
        {participant.name}
        <span
          aria-hidden
          id={descriptionId}
          className="text-xs uppercase dark:text-gray-400"
        >
          {formatter.format(new Date(participant.createdAt))}
        </span>
      </div>

      <IconButton icon={TrashIcon} aria-label="Remove" onClick={onRemove} />
    </li>
  )
}

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
})
