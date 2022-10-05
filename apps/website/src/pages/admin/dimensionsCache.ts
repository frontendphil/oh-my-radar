import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationUpdaterFunction,
  Reference,
  StoreValue,
} from "@apollo/client"
import { ReadFieldFunction } from "@apollo/client/cache/core/types/common"

import invariant from "invariant"
import {
  DeleteDimensionMutation,
  Dimensions_Insert_Input,
  Exact,
  InsertDimensionMutation,
} from "./api"

export const insertDimensionIntoCache: MutationUpdaterFunction<
  InsertDimensionMutation,
  Exact<{ dimension: Dimensions_Insert_Input }>,
  DefaultContext,
  ApolloCache<unknown>
> = (cache, { data }) => {
  if (!data || !data.insert_dimensions_one) {
    return
  }

  updateDimensionsInCache(cache, (dimensionsRef) => [
    ...dimensionsRef,
    data.insert_dimensions_one,
  ])
}

export const removeDimensionFromCache: MutationUpdaterFunction<
  DeleteDimensionMutation,
  Exact<{ id: string }>,
  DefaultContext,
  ApolloCache<unknown>
> = (cache, { data }) => {
  if (!data || !data.delete_dimensions_by_pk) {
    return
  }

  const { id } = data.delete_dimensions_by_pk

  updateDimensionsInCache(cache, (dimensionsRef, { readField }) =>
    dimensionsRef
      .map((dimensionRef) => ({
        id: readField("id", dimensionRef),
      }))
      .filter((dimension) => dimension.id !== id)
  )
}

const updateDimensionsInCache = (
  cache: ApolloCache<unknown>,
  callback: (
    dimensions: Reference[],
    options: { readField: ReadFieldFunction }
  ) => StoreValue
) => {
  cache.modify({
    fields: {
      charts_by_pk(chartRef: Reference, { readField }) {
        const dimensionsRef = readField("dimensions", chartRef)

        invariant(
          Array.isArray(dimensionsRef),
          `Chart with id "${readField(
            "id",
            chartRef
          )} does not specify "dimensions".`
        )

        const update = cache.writeFragment({
          id: chartRef.__ref,
          fragment: gql`
            fragment dimensions on charts {
              dimensions {
                id
              }
            }
          `,
          data: {
            dimensions: callback(dimensionsRef, { readField }),
          },
        })

        return update
      },
    },
  })
}
