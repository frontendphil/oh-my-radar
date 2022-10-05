import invariant from "invariant"
import { useParams } from "react-router-dom"
import { AdminGetChartQuery, useAdminGetChartQuery } from "./api"

export const useChart = (): AdminGetChartQuery["charts_by_pk"] => {
  const { id } = useParams()

  invariant(id, "Cannot show a chart without an id.")

  const { loading, data } = useAdminGetChartQuery({ variables: { id } })

  if (loading) {
    return null
  }

  invariant(data, "Chart has finished loading but there is no data.")
  invariant(data.charts_by_pk, "Could not load chart.")

  return data.charts_by_pk
}
