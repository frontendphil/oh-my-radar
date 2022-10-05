import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationUpdaterFunction,
  Reference,
} from "@apollo/client"
import invariant from "invariant"
import { DeleteParticipantMutation, Exact } from "./api"

export const removeParticipantsFromCache: MutationUpdaterFunction<
  DeleteParticipantMutation,
  Exact<{ id: string }>,
  DefaultContext,
  ApolloCache<unknown>
> = (cache, { data }) => {
  if (!data || !data.delete_participants_by_pk) {
    return
  }

  const { id } = data.delete_participants_by_pk

  cache.modify({
    fields: {
      charts_by_pk(chartRef: Reference, { readField }) {
        const participantRefs = readField("participants", chartRef)

        invariant(
          Array.isArray(participantRefs),
          `Chart with id "${readField(
            "id",
            chartRef
          )}" does not specify "participants".`
        )

        const update = cache.writeFragment({
          id: chartRef.__ref,
          fragment: gql`
            fragment participants on charts {
              participants {
                id
              }
            }
          `,
          data: {
            participants: participantRefs
              .map((participantRef) => ({
                id: readField("id", participantRef),
              }))
              .filter((participant) => participant.id !== id),
          },
        })

        return update
      },
    },
  })
}
