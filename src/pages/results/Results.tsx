import invariant from "invariant"
import { useParams } from "react-router-dom"
import { Participants } from "../../chart-configuration"
import { Colors, Participant, RadarChart, Selection } from "../../radar-chart"
import { useResultGetChartQuery } from "./api"

export const Results = () => {
  const { id } = useParams()

  const { loading, data } = useResultGetChartQuery({ variables: { id } })

  if (loading) {
    return null
  }

  invariant(data?.charts_by_pk, "Could not load chart.")

  const { title, min, max, dimensions, participants } = data.charts_by_pk

  return (
    <div className="grid grid-cols-2">
      <div className="m-24">
        <RadarChart title={title} dimensions={dimensions} range={[min, max]}>
          {participants.map(({ id, name, color, selections }) => (
            <Selection
              key={id}
              name={name}
              color={isColor(color) ? color : undefined}
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
      </div>

      <div className="mt-24">
        <Participants
          participants={participants.map(toParticipant)}
          onAdd={() => {}}
          onChange={() => {}}
        />
      </div>
    </div>
  )
}

const isColor = (color: unknown): color is Colors => true

const toParticipant = (participant: unknown): Participant => {
  invariant(isParticipant(participant), "No participant")

  return participant
}

const isParticipant = (participant: unknown): participant is Participant => true
