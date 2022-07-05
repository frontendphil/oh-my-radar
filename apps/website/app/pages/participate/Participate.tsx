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
} from "@radar/chart"
import { ParticipantGetChartQuery } from "../../api/participate"
import { Form } from "@remix-run/react"

type Props = {
  chart: ParticipantGetChartQuery
}

export const Participate = ({ chart }: Props) => {
  const { id: chartId } = useParams()

  // const { loading, data } = useParticipantGetChartQuery({
  //   variables: { id: chartId },
  // })
  // const [insertParticipant] = useInsertParticipantMutation()
  // const [insertSelections] = useInsertSelectionsMutation()
  const [selection, setSelection] = useState<SelectionState>({})
  const [name, setName] = useState("")

  invariant(chart?.charts_by_pk, "Could not load chart data")

  const { title, dimensions, min, max } = chart.charts_by_pk

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

        <Form method="post">
          <input
            type="hidden"
            name="selection"
            value={JSON.stringify(selection)}
          />

          <InputWithButton
            label="Name"
            name="name"
            value={name}
            onChange={setName}
          >
            <Button
              type="submit"
              disabled={
                name.trim() === "" ||
                !isSelectionCompleted(dimensions, selection)
              }
            >
              Submit
            </Button>
          </InputWithButton>
        </Form>
      </div>
    </View>
  )
}

const isSelectionCompleted = (
  dimensions: Dimension[],
  selection: SelectionState
): boolean => dimensions.every(({ id }) => selection[id] != null)
