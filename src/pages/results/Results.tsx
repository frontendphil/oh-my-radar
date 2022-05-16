import invariant from "invariant"
import { useEffect, useId, useState } from "react"
import { useParams } from "react-router-dom"
import { Label } from "../../form-controls"
import {
  Canvas,
  InputLayout,
  List,
  ListItem,
  SidePanel,
  View,
} from "../../layout"

import {
  Aggregate,
  Colors,
  Participant,
  RadarChart,
  Selection,
} from "../../radar-chart"
import { useResultGetChartQuery } from "./api"
import { ParticipantSelect } from "./ParticipantSelect"

export const Results = () => {
  const { id } = useParams()
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [aggregates, setAggregates] = useState({ average: false })

  const { loading, data } = useResultGetChartQuery({ variables: { id } })

  useEffect(() => {
    if (data?.charts_by_pk?.participants) {
      setSelectedParticipants(
        data?.charts_by_pk?.participants.map(({ id }) => id)
      )
    }
  }, [data?.charts_by_pk?.participants])

  if (loading) {
    return null
  }

  invariant(data?.charts_by_pk, "Could not load chart.")

  const { title, min, max, dimensions, participants } = data.charts_by_pk

  const participantsWithColors = participants.map((participant, index) => ({
    ...participant,
    color: getColor(index),
  }))

  return (
    <View>
      <Canvas>
        <RadarChart title={title} dimensions={dimensions} range={[min, max]}>
          {participantsWithColors
            .filter(({ id }) => selectedParticipants.includes(id))
            .map(({ id, name, color, selections }) => (
              <Selection
                key={id}
                name={name}
                color={color}
                value={selections.reduce(
                  (result, { dimensionId, value }) => ({
                    ...result,
                    [dimensionId]: value,
                  }),
                  {}
                )}
              />
            ))}

          {aggregates.average && (
            <Aggregate
              name="Average"
              value={dimensions.reduce(
                (result, { id, selections_aggregate }) => {
                  return {
                    ...result,
                    [id]: selections_aggregate.aggregate?.avg?.value,
                  }
                },
                {}
              )}
            />
          )}
        </RadarChart>
      </Canvas>

      <SidePanel>
        <div className="flex flex-col gap-12">
          <ParticipantSelect
            participants={participantsWithColors.map(toParticipant)}
            value={selectedParticipants}
            onChange={setSelectedParticipants}
          />

          <Aggregates aggregates={aggregates} onChange={setAggregates} />
        </div>
      </SidePanel>
    </View>
  )
}

type AggregateState = {
  average: boolean
}

type AggregateProps = {
  aggregates: AggregateState
  onChange: (aggregates: AggregateState) => void
}

const Aggregates = ({ aggregates, onChange }: AggregateProps) => {
  const id = useId()

  return (
    <InputLayout label={<Label htmlFor={id}>Aggregates</Label>}>
      <List id={id}>
        <ListItem>
          <Average
            checked={aggregates.average}
            onChange={(checked) =>
              onChange({ ...aggregates, average: checked })
            }
          />
        </ListItem>
      </List>
    </InputLayout>
  )
}

type AverageProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

const Average = ({ checked, onChange }: AverageProps) => {
  const id = useId()

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        className="mr-4"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <label htmlFor={id}>Average</label>
    </div>
  )
}

const toParticipant = (participant: unknown): Participant => {
  invariant(isParticipant(participant), "No participant")

  return participant
}

const isParticipant = (participant: unknown): participant is Participant => true

export const getColor = (index: number): Colors => {
  const allColors = Object.values(Colors)

  return allColors[index % allColors.length]
}
