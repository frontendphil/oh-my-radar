import invariant from "invariant"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button, InputWithButton } from "../../form-controls"
import {
  Colors,
  Dimension,
  RadarChart,
  Selection,
  SelectionState,
} from "../../radar-chart"
import {
  useInsertParticipantMutation,
  useInsertSelectionsMutation,
  useParticipantGetChartQuery,
} from "./api"

export const Participate = () => {
  const { id: chartId } = useParams()

  const { loading, data } = useParticipantGetChartQuery({
    variables: { id: chartId },
  })
  const [insertParticipant] = useInsertParticipantMutation()
  const [insertSelections] = useInsertSelectionsMutation()
  const [selection, setSelection] = useState<SelectionState>({})
  const [name, setName] = useState("")

  const [finished, setFinished] = useState(false)

  if (finished) {
    return <>Thank you</>
  }

  if (loading) {
    return null
  }

  invariant(data?.charts_by_pk, "Could not load chart data")

  const { title, dimensions, min, max } = data.charts_by_pk

  return (
    <div className="mt-24 flex flex-col items-center justify-center gap-12">
      <RadarChart title={title} dimensions={dimensions} range={[min, max]}>
        <Selection
          active
          name={name}
          color={Colors.purple}
          value={selection}
          onChange={setSelection}
        />
      </RadarChart>

      <InputWithButton label="Name" value={name} onChange={setName}>
        <Button
          disabled={
            name.trim() === "" || !isSelectionCompleted(dimensions, selection)
          }
          onClick={() => {
            insertParticipant({
              variables: { participant: { chartId, name, color: Colors.blue } },
              onCompleted: (data) => {
                invariant(
                  data.insert_participants_one,
                  "Could not insert participant"
                )

                const { id: participantId } = data.insert_participants_one

                insertSelections({
                  variables: {
                    selections: Object.entries(selection).map(
                      ([dimensionId, value]) => ({
                        chartId,
                        dimensionId,
                        participantId,
                        value,
                      })
                    ),
                  },
                  onCompleted: () => setFinished(true),
                })
              },
            })
          }}
        >
          Submit
        </Button>
      </InputWithButton>
    </div>
  )
}

const isSelectionCompleted = (
  dimensions: Dimension[],
  selection: SelectionState
): boolean => dimensions.every(({ id }) => selection[id] != null)
