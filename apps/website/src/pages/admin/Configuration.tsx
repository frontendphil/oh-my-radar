import { Dimensions } from "./Dimensions"
import {
  DangerButton,
  Form,
  FormGroup,
  IconButton,
  Input,
  InputWithButton,
  NumberInput,
} from "../../form-controls"
import {
  Charts_Set_Input,
  useDeleteChartMutation,
  useDeleteDimensionMutation,
  useInsertDimensionMutation,
  useUpdateChartMutation,
  useUpdateDimensionMutation,
} from "./api"

import { Divider } from "../../layout"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"
import { useChart } from "./useChart"
import { gql, Reference } from "@apollo/client"
import invariant from "invariant"

export const Configuration = () => {
  const navigate = useNavigate()

  const chart = useChart()

  const [updateChart, { loading: updatingChart }] = useUpdateChartMutation()
  const [deleteChart, { loading: deletingChart }] = useDeleteChartMutation({
    onCompleted: () => navigate("/"),
  })
  const [insertDimension, { loading: insertingDimension }] =
    useInsertDimensionMutation({
      update: (cache, { data }) => {
        if (!data || !data.insert_dimensions_one) {
          return
        }

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
                  dimensions: [
                    ...dimensionsRef.map((dimensionRef) => ({
                      id: readField("id", dimensionRef),
                    })),
                    data.insert_dimensions_one,
                  ],
                },
              })

              return update
            },
          },
        })
      },
    })
  const [deleteDimension, { loading: deletingDimension }] =
    useDeleteDimensionMutation({
      update: (cache, { data }) => {
        if (!data || !data.delete_dimensions_by_pk) {
          return
        }

        const { id } = data.delete_dimensions_by_pk

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
                  dimensions: dimensionsRef
                    .map((dimensionRef) => ({
                      id: readField("id", dimensionRef),
                    }))
                    .filter((dimension) => dimension.id !== id),
                },
              })

              return update
            },
          },
        })
      },
    })
  const [updateDimension, { loading: updatingDimension }] =
    useUpdateDimensionMutation()

  if (!chart) {
    return null
  }

  const loading =
    updatingChart ||
    deletingChart ||
    insertingDimension ||
    deletingDimension ||
    updatingDimension

  const { title, dimensions, min, max } = chart

  const saveChart = (payload: Charts_Set_Input) => {
    updateChart({
      variables: { pk: { id: chart.id }, payload },
    })
  }

  return (
    <div className="h-full py-6 px-2 md:px-6">
      <div className="flex h-full flex-col justify-between">
        <div>
          <Form>
            <Input
              label="Title"
              defaultValue={title}
              disabled={loading}
              onBlur={(event) => saveChart({ title: event.target.value })}
            />

            <FormGroup>
              <NumberInput
                label="Min value"
                defaultValue={min}
                disabled={loading}
                isValid={(value) =>
                  value < max
                    ? [true]
                    : [false, `Min value must be less than ${max}`]
                }
                onBlur={(event) =>
                  saveChart({ min: event.target.valueAsNumber })
                }
              />

              <NumberInput
                label="Max value"
                defaultValue={max}
                disabled={loading}
                isValid={(value) =>
                  value > min
                    ? [true]
                    : [false, `Max value must be greater than ${min}`]
                }
                onBlur={(event) =>
                  saveChart({ max: event.target.valueAsNumber })
                }
              />
            </FormGroup>

            <Dimensions
              dimensions={dimensions}
              disabled={loading}
              onAdd={(dimension) =>
                insertDimension({
                  variables: { dimension: { chartId: chart.id, ...dimension } },
                })
              }
              onRemove={(dimensionId) =>
                deleteDimension({
                  variables: { id: dimensionId },
                })
              }
              onChange={(dimension) =>
                updateDimension({
                  variables: {
                    pk: { id: dimension.id },
                    payload: {
                      chartId: chart.id,
                      id: dimension.id,
                      title: dimension.title,
                    },
                  },
                })
              }
            />
          </Form>

          <Divider />

          <div className="flex flex-col gap-10">
            <InputWithButton
              disabled
              label="Participant view"
              hint="Give this link to the people who should fill out this chart."
              value={resourceURL("participate", chart.id)}
            >
              <IconButton
                icon={ArrowTopRightOnSquareIcon}
                onClick={() =>
                  window.open(resourceURL("participate", chart.id))
                }
              />
            </InputWithButton>

            <InputWithButton
              disabled
              label="Results view"
              hint="Use this link to see all answers that have been submitted. Everyone with this link can see the results."
              value={resourceURL("results", chart.id)}
            >
              <IconButton
                icon={ArrowTopRightOnSquareIcon}
                onClick={() => window.open(resourceURL("results", chart.id))}
              />
            </InputWithButton>
          </div>
        </div>

        <div className="text-right">
          <Divider size="tighter" />

          <DangerButton
            disabled={loading}
            onClick={() => deleteChart({ variables: { id: chart.id } })}
          >
            Delete chart
          </DangerButton>
        </div>
      </div>
    </div>
  )
}

const resourceURL = (resource: string, id: string) => {
  if ("Cypress" in window) {
    return `http://test-host.com/${resource}/test-id`
  }

  return `${location.origin}/${resource}/${id}`
}
