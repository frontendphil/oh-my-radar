import { Dimensions } from "./Dimensions"
import { Form, FormGroup, Input, NumberInput } from "../../form-controls"
import {
  AdminGetChartQuery,
  useDeleteDimensionMutation,
  useInsertDimensionMutation,
  useUpdateChartMutation,
} from "./api"
import { useEffect } from "react"
import { useConfiguration } from "./useConfiguration"
import invariant from "invariant"
import { Divider } from "../../layout"

type Props = {
  chart: NonNullable<AdminGetChartQuery["charts_by_pk"]>
}

export const Configuration = ({ chart }: Props) => {
  const [configuration, updateConfiguration] = useConfiguration()

  const [updateChart] = useUpdateChartMutation()
  const [insertDimension] = useInsertDimensionMutation()
  const [deleteDimension] = useDeleteDimensionMutation()

  useEffect(() => {
    const { title, min, max, dimensions } = chart

    updateConfiguration({
      title,
      dimensions,
      range: [min, max],
    })
  }, [chart, updateConfiguration])

  const { title, dimensions, range } = configuration

  const [min, max] = range

  const saveChart = () => {
    updateChart({
      variables: { pk: { id: chart.id }, payload: { title, min, max } },
    })
  }

  return (
    <>
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
              variables: { dimension: { chartId: chart.id, ...dimension } },
              onCompleted: (data) => {
                invariant(
                  data.insert_dimensions_one,
                  "Dimension could not be created."
                )

                const { id, title } = data.insert_dimensions_one

                updateConfiguration((currentConfiguration) => ({
                  dimensions: currentConfiguration.dimensions.map((dimension) =>
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
                  dimensions: dimensions.filter(({ id }) => id !== dimensionId),
                })
              },
            })
          }}
        />
      </Form>

      <Divider />

      <div className="flex flex-col gap-10">
        <Input
          disabled
          label="Participant view"
          hint="Give this link to the people who should fill out this chart."
          value={resourceURL("participate", chart.id)}
        />

        <Input
          disabled
          label="Results view"
          hint="Use this link to see all answers that have been submitted. Everyone with this link can see the results."
          value={resourceURL("results", chart.id)}
        />
      </div>
    </>
  )
}

const resourceURL = (resource: string, id: string) => {
  if ("Cypress" in window) {
    return `http://test-host.com/${resource}/test-id`
  }

  return `${location.origin}/${resource}/${id}`
}
