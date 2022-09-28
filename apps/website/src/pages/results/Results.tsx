import invariant from "invariant"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Canvas, SidePanel, View } from "../../layout"
import {
  Aggregate,
  Colors,
  Participant,
  RadarChart,
  Selection,
} from "@radar/chart"
import { Aggregates } from "./Aggregates"
import { useResultGetChartQuery } from "./api"
import { Participants } from "./Participants"

export const Results = () => {
  const { id } = useParams()
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [aggregates, setAggregates] = useState({
    average: false,
    min: false,
    max: false,
  })

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
              color={Colors.green}
              value={dimensions.reduce(
                (result, { id, selections_aggregate }) => ({
                  ...result,
                  [id]: selections_aggregate.aggregate?.avg?.value,
                }),
                {}
              )}
            />
          )}
          {aggregates.min && (
            <Aggregate
              name="Min"
              color={Colors.blue}
              value={dimensions.reduce(
                (result, { id, selections_aggregate }) => ({
                  ...result,
                  [id]: selections_aggregate.aggregate?.min?.value,
                }),
                {}
              )}
            />
          )}
          {aggregates.max && (
            <Aggregate
              name="Max"
              color={Colors.yellow}
              value={dimensions.reduce(
                (result, { id, selections_aggregate }) => ({
                  ...result,
                  [id]: selections_aggregate.aggregate?.max?.value,
                }),
                {}
              )}
            />
          )}
        </RadarChart>
      </Canvas>

      <SidePanel>
        <div className="flex flex-col gap-12 py-6 px-6 md:py-12">
          <Participants
            participants={participantsWithColors.map(toParticipant)}
            value={selectedParticipants}
            onChange={setSelectedParticipants}
          />

          {participantsWithColors.length > 0 && (
            <Aggregates aggregates={aggregates} onChange={setAggregates} />
          )}
        </div>
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
