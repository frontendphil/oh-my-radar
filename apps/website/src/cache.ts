import { FieldMergeFunction, InMemoryCache, Reference } from "@apollo/client"
import invariant from "invariant"

export const createCache = () =>
  new InMemoryCache({
    typePolicies: {
      charts: {
        merge: true,
        fields: {
          participants: {
            merge: mergeArrays,
          },
          dimensions: {
            merge: mergeArrays,
          },
        },
      },
    },
  })

const mergeArrays: FieldMergeFunction<Reference[]> = (
  existing,
  incoming,
  { mergeObjects, readField }
) => {
  const idToIndex: Record<string, number> = {}

  const existingIds = existing
    ? existing.map((item) => readField<string>("id", item))
    : []

  const incomingIds = incoming.map((item) => readField<string>("id", item))

  const deletedIds = existingIds.filter((id) => !incomingIds.includes(id))

  const merged = existing
    ? existing.filter(
        (item) => !deletedIds.includes(readField<string>("id", item))
      )
    : []

  if (existing) {
    existing.forEach((item, index) => {
      const id = readField<string>("id", item)

      invariant(id, 'Cannot read "id" from existing item.')

      idToIndex[id] = index
    })
  }

  incoming.forEach((item) => {
    const id = readField<string>("id", item)

    invariant(id, 'Cannot read "id" from incoming item.')

    const index = idToIndex[id]

    if (index != null) {
      merged[index] = mergeObjects(merged[index], item)
    } else {
      idToIndex[id] = merged.length
      merged.push(item)
    }
  })

  return merged
}
