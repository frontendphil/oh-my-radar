import { TrashIcon } from "@heroicons/react/24/outline"
import { SelectionState } from "@radar/chart"
import { useId } from "react"
import { IconButton } from "../../form-controls"
import { Hint } from "../../layout"
import { ItemType } from "../test-utils"
import { AdminGetChartQuery, useDeleteParticipantMutation } from "./api"
import { removeParticipantsFromCache } from "./participantsCache"

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
    update: removeParticipantsFromCache,
  })

  return (
    <>
      <ul
        aria-label="Participants"
        aria-describedby={participants.length === 0 ? descriptionId : undefined}
        className="flex flex-col gap-4 py-6 px-2 md:px-4"
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
      className="flex cursor-default items-center justify-between rounded border-2 border-transparent py-2 px-2 hover:border-gray-300 hover:bg-gray-200 dark:hover:border-gray-700 dark:hover:bg-gray-800"
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
