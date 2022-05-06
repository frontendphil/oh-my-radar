import invariant from "invariant"
import { useParams } from "react-router-dom"
import { Canvas, SidePanel, View } from "../../layout"

import { Colors, Participant, RadarChart, Selection } from "../../radar-chart"
import { useResultGetChartQuery } from "./api"
import { Participants } from "./Participants"

export const Results = () => {
  const { id } = useParams()

  const { loading, data } = useResultGetChartQuery({ variables: { id } })

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
          {participantsWithColors.map(({ id, name, color, selections }) => (
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
        </RadarChart>
      </Canvas>

      <SidePanel>
        <Participants
          participants={participantsWithColors.map(toParticipant)}
        />
      </SidePanel>
    </View>
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
