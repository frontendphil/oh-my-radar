import { InMemoryCache, Reference } from "@apollo/client"
import invariant from "invariant"

export const createCache = () =>
  new InMemoryCache({
    typePolicies: {
      charts: {
        merge: true,
        fields: {
          participants: {
            merge(
              existing: Reference[],
              incoming: Reference[],
              { mergeObjects, readField }
            ) {
              const idToIndex: Record<string, number> = {}

              const existingIds = existing
                ? existing.map((participant) =>
                    readField<string>("id", participant)
                  )
                : []

              const incomingIds = incoming.map((participant) =>
                readField<string>("id", participant)
              )

              const deletedIds = existingIds.filter(
                (id) => !incomingIds.includes(id)
              )

              const merged = existing
                ? existing.filter(
                    (participant) =>
                      !deletedIds.includes(readField<string>("id", participant))
                  )
                : []

              if (existing) {
                existing.forEach((participant, index) => {
                  const id = readField<string>("id", participant)

                  invariant(id, 'Cannot read "id" from existing participant.')

                  idToIndex[id] = index
                })
              }

              incoming.forEach((participant) => {
                const id = readField<string>("id", participant)

                invariant(id, 'Cannot read "id" from incoming participant.')

                const index = idToIndex[id]

                if (index != null) {
                  merged[index] = mergeObjects(merged[index], participant)
                } else {
                  idToIndex[id] = merged.length
                  merged.push(participant)
                }
              })

              return merged
            },
          },
        },
      },
    },
  })
