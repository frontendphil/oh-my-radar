import { useParams } from "react-router-dom"
import invariant from "invariant"
import { RadarChart, Selection } from "../../radar-chart"
import { useGetChartQuery, useUpdateChartMutation } from "./__generated__/api"

import { ChartConfiguration, useConfiguration } from "../../chart-configuration"
import { useEffect } from "react"

export const Admin = () => {
  const { id } = useParams()

  const [configuration, updateConfiguration] = useConfiguration()

  const { loading, data } = useGetChartQuery({ variables: { id } })
  const [updateChart] = useUpdateChartMutation()

  useEffect(() => {
    if (!data?.charts_by_pk) {
      return
    }

    const { title, min, max, dimensions } = data.charts_by_pk

    updateConfiguration({
      title,
      dimensions,
      range: [min, max],
    })
  }, [data?.charts_by_pk, updateConfiguration])

  if (loading) {
    return null
  }

  invariant(data?.charts_by_pk, "Could not load chart data")

  const { title, dimensions, range } = configuration

  const [min, max] = range

  return (
    <div className="grid grid-cols-2">
      <div className="m-24">
        <RadarChart title={title} dimensions={dimensions} range={range}>
          <Selection active name="example" />
        </RadarChart>
      </div>
      <div className="mt-24 mr-24">
        <ChartConfiguration
          configuration={configuration}
          onChange={updateConfiguration}
          onSubmit={() => {
            updateChart({
              variables: { pk: { id }, payload: { title, min, max } },
            })
          }}
        />
      </div>
    </div>
  )
}
