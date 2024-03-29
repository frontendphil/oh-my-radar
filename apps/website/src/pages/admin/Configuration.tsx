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
import {
  insertDimensionIntoCache,
  removeDimensionFromCache,
} from "./dimensionsCache"

export const Configuration = () => {
  const navigate = useNavigate()

  const { title, dimensions, min, max, id } = useChart()

  const [updateChart, { loading: updatingChart }] = useUpdateChartMutation()
  const [deleteChart, { loading: deletingChart }] = useDeleteChartMutation({
    onCompleted: () => navigate("/"),
  })
  const [insertDimension, { loading: insertingDimension }] =
    useInsertDimensionMutation({
      update: insertDimensionIntoCache,
    })
  const [deleteDimension, { loading: deletingDimension }] =
    useDeleteDimensionMutation({
      update: removeDimensionFromCache,
    })
  const [updateDimension, { loading: updatingDimension }] =
    useUpdateDimensionMutation()

  const loading =
    updatingChart ||
    deletingChart ||
    insertingDimension ||
    deletingDimension ||
    updatingDimension

  const saveChart = (payload: Charts_Set_Input) => {
    updateChart({
      variables: { pk: { id }, payload },
    })
  }

  return (
    <div className="py-6 px-2 md:px-6">
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
                  variables: { dimension: { chartId: id, ...dimension } },
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
                      chartId: id,
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
              value={resourceURL("participate", id)}
            >
              <IconButton
                icon={ArrowTopRightOnSquareIcon}
                onClick={() => window.open(resourceURL("participate", id))}
              />
            </InputWithButton>

            <InputWithButton
              disabled
              label="Results view"
              hint="Use this link to see all answers that have been submitted. Everyone with this link can see the results."
              value={resourceURL("results", id)}
            >
              <IconButton
                icon={ArrowTopRightOnSquareIcon}
                onClick={() => window.open(resourceURL("results", id))}
              />
            </InputWithButton>
          </div>
        </div>

        <div className="text-right">
          <Divider size="tighter" />

          <DangerButton
            disabled={loading}
            onClick={() => deleteChart({ variables: { id } })}
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
