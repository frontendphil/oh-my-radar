import { useParams } from "react-router-dom"
import invariant from "invariant"
import { RadarChart, Selection } from "../../radar-chart"
import {
  useAdminGetChartQuery,
  useDeleteDimensionMutation,
  useInsertDimensionMutation,
  useUpdateChartMutation,
} from "./api"

import { useEffect } from "react"

import { Form, FormGroup, Input, NumberInput } from "../../form-controls"
import { useConfiguration } from "./useConfiguration"
import { Dimensions } from "./Dimensions"

export const Admin = () => {
  const { id } = useParams()

  const [configuration, updateConfiguration] = useConfiguration()

  const { loading, data } = useAdminGetChartQuery({ variables: { id } })
  const [updateChart] = useUpdateChartMutation()
  const [insertDimension] = useInsertDimensionMutation()
  const [deleteDimension] = useDeleteDimensionMutation()

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

  const saveChart = () => {
    updateChart({
      variables: { pk: { id }, payload: { title, min, max } },
    })
  }

  return (
    <div className="grid grid-cols-2">
      <div className="m-24">
        <RadarChart title={title} dimensions={dimensions} range={range}>
          <Selection active name="example" />
        </RadarChart>
      </div>
      <div className="mt-24 mr-24">
        <Form>
          <Input
            label="Title"
            value={title}
            onChange={(title) => updateConfiguration({ title })}
            onBlur={saveChart}
          />

          <FormGroup>
            <NumberInput
              label="Min value"
              value={min}
              isValid={(value) =>
                value < max
                  ? [true]
                  : [false, `Min value must be less than ${max}`]
              }
              onChange={(value) =>
                updateConfiguration({
                  range: [value, max],
                })
              }
              onBlur={saveChart}
            />

            <NumberInput
              label="Max value"
              value={max}
              isValid={(value) =>
                value > min
                  ? [true]
                  : [false, `Max value must be greater than ${min}`]
              }
              onChange={(value) =>
                updateConfiguration({
                  range: [min, value],
                })
              }
              onBlur={saveChart}
            />
          </FormGroup>

          <Dimensions
            dimensions={dimensions}
            onAdd={(dimension) => {
              insertDimension({
                variables: { dimension: { chartId: id, ...dimension } },
                onCompleted: (data) => {
                  invariant(
                    data.insert_dimensions_one,
                    "Dimension could not be created."
                  )

                  const { id, title } = data.insert_dimensions_one

                  updateConfiguration({
                    dimensions: [...configuration.dimensions, { id, title }],
                  })
                },
              })
            }}
            onRemove={(dimensionId) => {
              deleteDimension({
                variables: { id: dimensionId },
                onCompleted: () => {
                  updateConfiguration({
                    dimensions: dimensions.filter(
                      ({ id }) => id !== dimensionId
                    ),
                  })
                },
              })
            }}
          />
        </Form>
      </div>
    </div>
  )
}
