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
import { Canvas, SidePanel, View } from "../../layout"

export const Admin = () => {
  const { id } = useParams()

  invariant(id, "Cannot show a chart without an id.")

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
    <View>
      <Canvas>
        <RadarChart title={title} dimensions={dimensions} range={range}>
          <Selection name="example" />
        </RadarChart>
      </Canvas>
      <SidePanel>
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
              updateConfiguration({
                dimensions: [
                  ...configuration.dimensions,
                  { ...dimension, id: "new" },
                ],
              })

              insertDimension({
                variables: { dimension: { chartId: id, ...dimension } },
                onCompleted: (data) => {
                  invariant(
                    data.insert_dimensions_one,
                    "Dimension could not be created."
                  )

                  const { id, title } = data.insert_dimensions_one

                  updateConfiguration((currentConfiguration) => ({
                    dimensions: currentConfiguration.dimensions.map(
                      (dimension) =>
                        dimension.id === "new" ? { id, title } : dimension
                    ),
                  }))
                },
              })
            }}
            onRemove={(dimensionId) => {
              updateConfiguration({
                dimensions: dimensions.map((dimension) =>
                  dimension.id === dimensionId
                    ? { ...dimension, deleted: true }
                    : dimension
                ),
              })

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

        <hr className="my-12 border-yellow-500" />

        <div className="flex flex-col gap-10">
          <Input
            disabled
            label="Participant view"
            hint="Give this link to the people who should fill out this chart."
            value={resourceURL("participate", id)}
          />

          <Input
            disabled
            label="Results view"
            hint="Use this link to see all answers that have been submitted. Everyone with this link can see the results."
            value={resourceURL("results", id)}
          />
        </div>
      </SidePanel>
    </View>
  )
}

const resourceURL = (resource: string, id: string) => {
  if ("Cypress" in window) {
    return `http://test-host.com/${resource}/test-id`
  }

  return `${location.origin}/${resource}/${id}`
}
