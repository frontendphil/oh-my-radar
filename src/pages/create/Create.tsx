import invariant from "invariant"
import { useNavigate } from "react-router-dom"
import { Button } from "../../form-controls"
import { useCreateChartMutation, useCreateDimensionsMutation } from "./api"

export const Create = () => {
  const navigate = useNavigate()

  const [addChart, { loading: loadingChart }] = useCreateChartMutation()
  const [addDimensions, { loading: loadingDimensions }] =
    useCreateDimensionsMutation()

  return (
    <Button
      onClick={() =>
        addChart({
          variables: { chart: defaultChart() },
          onCompleted: ({ insert_charts_one }) => {
            invariant(
              insert_charts_one,
              "Something went wrong creating the chart."
            )

            const { id } = insert_charts_one

            addDimensions({
              variables: {
                dimensions: defaultDimensions(id),
              },
              onCompleted: () => {
                navigate(`/admin/${id}`)
              },
            })
          },
        })
      }
    >
      {loadingChart || loadingDimensions
        ? "Creating your chart..."
        : "Create new chart"}
    </Button>
  )
}

export const defaultDimensions = (chartId: string) => [
  { title: "One", chartId },
  { title: "Two", chartId },
  { title: "Three", chartId },
]

export const defaultChart = () => ({ title: "New chart", min: 1, max: 4 })
