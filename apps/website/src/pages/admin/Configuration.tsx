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
  AdminGetChartQuery,
  useDeleteChartMutation,
  useDeleteDimensionMutation,
  useInsertDimensionMutation,
  useUpdateChartMutation,
  useUpdateDimensionMutation,
} from "./api"
import { useEffect } from "react"
import { useConfiguration } from "./useConfiguration"
import invariant from "invariant"
import { Divider } from "../../layout"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"

type Props = {
  chart: NonNullable<AdminGetChartQuery["charts_by_pk"]>
}

export const Configuration = ({ chart }: Props) => {
  const [configuration, updateConfiguration] = useConfiguration()
  const navigate = useNavigate()

  const [updateChart, { loading: updatingChart }] = useUpdateChartMutation()
  const [deleteChart, { loading: deletingChart }] = useDeleteChartMutation({
    onCompleted: () => navigate("/"),
  })
  const [insertDimension, { loading: insertingDimension }] =
    useInsertDimensionMutation()
  const [deleteDimension, { loading: deletingDimension }] =
    useDeleteDimensionMutation()
  const [updateDimension, { loading: updatingDimension }] =
    useUpdateDimensionMutation()

  const loading =
    updatingChart ||
    deletingChart ||
    insertingDimension ||
    deletingDimension ||
    updatingDimension

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
    <div className="h-full py-6 px-2 md:px-6">
      <div className="flex h-full flex-col justify-between">
        <div>
          <Form>
            <Input
              label="Title"
              value={title}
              disabled={loading}
              onChange={(title) => updateConfiguration({ title })}
              onBlur={saveChart}
            />

            <FormGroup>
              <NumberInput
                label="Min value"
                value={min}
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
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
              onChange={(dimension) => {
                const index = dimensions.findIndex(
                  ({ id }) => id === dimension.id
                )

                updateConfiguration({
                  dimensions: [
                    ...dimensions.slice(0, index),
                    dimension,
                    ...dimensions.slice(index + 1),
                  ],
                })

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
              }}
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
