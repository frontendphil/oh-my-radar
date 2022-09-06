import invariant from "invariant"
import { useEffect, useState } from "react"
import { Canvas, SidePanel, View } from "../../layout"
import {
  Aggregate,
  Colors,
  Participant,
  RadarChart,
  Selection,
} from "@radar/chart"
import { Aggregates } from "./Aggregates"
import { Participants } from "./Participants"
import { ResultGetChartQuery } from "../../api/results"

type Props = {
  data: ResultGetChartQuery
}

export const Results = ({ data }: Props) => {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [aggregates, setAggregates] = useState({ average: false })

  useEffect(() => {
    if (data?.charts_by_pk?.participants) {
      setSelectedParticipants(
        data?.charts_by_pk?.participants.map(({ id }) => id)
      )
    }
  }, [data?.charts_by_pk?.participants])

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
          <Participants
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

const toParticipant = (participant: unknown): Participant => {
  invariant(isParticipant(participant), "No participant")

  return participant
}

const isParticipant = (participant: unknown): participant is Participant => true

export const getColor = (index: number): Colors => {
  const allColors = Object.values(Colors)

  return allColors[index % allColors.length]
}
