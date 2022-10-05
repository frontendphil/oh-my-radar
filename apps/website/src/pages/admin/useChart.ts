import invariant from "invariant"
import { useParams } from "react-router-dom"
import { AdminGetChartQuery, useAdminGetChartQuery } from "./api"

export const useChartId = (): string => {
  const { id } = useParams()

  invariant(id, "Cannot show a chart without an id.")

  return id
}

export const useChartQuery = (): AdminGetChartQuery["charts_by_pk"] => {
  const id = useChartId()

  const { loading, data } = useAdminGetChartQuery({ variables: { id } })

  if (loading) {
    return null
  }

  invariant(data, "Chart has finished loading but there is no data.")
  invariant(data.charts_by_pk, "Could not load chart.")

  return data.charts_by_pk
}

export const useChart = (): NonNullable<AdminGetChartQuery["charts_by_pk"]> => {
  const id = useChartId()

  const { data } = useAdminGetChartQuery({ variables: { id } })

  invariant(data, "Chart has finished loading but there is no data.")
  invariant(data.charts_by_pk, "Could not load chart.")

  return data.charts_by_pk
}
