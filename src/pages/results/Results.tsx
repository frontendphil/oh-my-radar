import invariant from "invariant"
import { useEffect, useId, useState } from "react"
import { useParams } from "react-router-dom"
import { Canvas, List, ListItem, SidePanel, View } from "../../layout"

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
  const [showAverage, setShowAverage] = useState(false)

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

          {showAverage && (
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
        <ParticipantSelect
          participants={participantsWithColors.map(toParticipant)}
          value={selectedParticipants}
          onChange={setSelectedParticipants}
        />

        <List>
          <ListItem>
            <Average checked={showAverage} onChange={setShowAverage} />
          </ListItem>
        </List>
      </SidePanel>
    </View>
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
