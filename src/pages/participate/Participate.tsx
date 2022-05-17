import invariant from "invariant"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button, InputWithButton } from "../../form-controls"
import { View } from "../../layout"
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
    return (
      <div className="flex h-full w-full items-center justify-center">
        <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-9xl font-bold uppercase italic text-transparent drop-shadow-2xl">
          Thank you
        </h1>
      </div>
    )
  }

  if (loading) {
    return null
  }

  invariant(data?.charts_by_pk, "Could not load chart data")

  const { title, dimensions, min, max } = data.charts_by_pk

  return (
    <View>
      <div className="flex w-full flex-col items-center justify-center gap-12 pt-12 md:pt-0">
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
                variables: {
                  participant: { chartId, name, color: Colors.blue },
                },
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
    </View>
  )
}

const isSelectionCompleted = (
  dimensions: Dimension[],
  selection: SelectionState
): boolean => dimensions.every(({ id }) => selection[id] != null)
