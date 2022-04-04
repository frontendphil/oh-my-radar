import { useParams } from "react-router-dom"
import invariant from "invariant"
import { RadarChart } from "../../radar-chart"
import { useGetChartQuery } from "./__generated__/api"

export const Admin = () => {
  const { id } = useParams()

  const { loading, data } = useGetChartQuery({ variables: { id } })

  if (loading) {
    return null
  }

  invariant(data?.charts_by_pk, "Could not load chart data")

  const { title, dimensions, min, max } = data.charts_by_pk

  return <RadarChart title={title} dimensions={dimensions} range={[min, max]} />
}
