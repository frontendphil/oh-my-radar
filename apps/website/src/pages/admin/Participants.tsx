import { gql, Reference } from "@apollo/client"
import { TrashIcon } from "@heroicons/react/24/outline"
import { SelectionState } from "@radar/chart"
import invariant from "invariant"
import { useId } from "react"
import { IconButton } from "../../form-controls"
import { Hint } from "../../layout"
import { ItemType } from "../test-utils"
import { AdminGetChartQuery, useDeleteParticipantMutation } from "./api"

type ApiChart = NonNullable<AdminGetChartQuery["charts_by_pk"]>

type ApiParticipant = ItemType<ApiChart["participants"]>

export type ActiveSelection = {
  name: string
  value: SelectionState
}

type Props = {
  participants: ApiParticipant[]
  onSelect: (activeSelection: ActiveSelection | null) => void
}

export const Participants = ({ participants, onSelect }: Props) => {
  const descriptionId = useId()

  const [deleteParticipant, { loading }] = useDeleteParticipantMutation({
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
                participants: participantRefs
                  .map((participantRef) => ({
                    id: readField("id", participantRef),
                  }))
                  .filter((participant) => participant.id !== id),
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
            disabled={loading}
            onRemove={() =>
              deleteParticipant({ variables: { id: participant.id } })
            }
            onSelect={(selection) =>
              selection
                ? onSelect({ name: participant.name, value: selection })
                : onSelect(null)
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
  disabled: boolean
  onRemove: () => void
  onSelect: (selection: SelectionState | null) => void
}

const Participant = ({
  participant,
  disabled,
  onRemove,
  onSelect,
}: ParticipantProps) => {
  const descriptionId = useId()

  return (
    <li
      aria-label={participant.name}
      aria-describedby={descriptionId}
      className="flex items-center justify-between"
      onMouseEnter={() =>
        onSelect(
          participant.selections.reduce(
            (result, { dimensionId, value }) => ({
              ...result,
              [dimensionId]: value,
            }),
            {}
          )
        )
      }
      onMouseLeave={() => onSelect(null)}
    >
      <div className="flex flex-col ">
        {participant.name}
        <span
          aria-hidden
          id={descriptionId}
          className="text-xs uppercase text-gray-600 dark:text-gray-400"
        >
          {formatter.format(new Date(participant.createdAt))}
        </span>
      </div>

      <IconButton
        disabled={disabled}
        icon={TrashIcon}
        aria-label="Remove"
        onClick={onRemove}
      />
    </li>
  )
}

const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
})
