import invariant from "invariant"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Button, Input } from "../../form-controls"
import {
  Colors,
  RadarChart,
  Selection,
  SelectionState,
} from "../../radar-chart"
import {
  useInsertParticipantMutation,
  useInsertSelectionsMutation,
  useParticipantGetChartQuery,
} from "./__generated__/api"

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
    <div className="m-24">
      <RadarChart title={title} dimensions={dimensions} range={[min, max]}>
        <Selection active name="" value={selection} onChange={setSelection} />
      </RadarChart>

      <Input label="Name" value={name} onChange={setName} />

      <Button
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
    </div>
  )
}
