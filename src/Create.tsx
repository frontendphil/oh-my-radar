import invariant from "invariant"
import { useNavigate } from "react-router-dom"
import { Button } from "./form-controls"
import {
  useCreateChartMutation,
  useCreateDimensionsMutation,
} from "./__generated__/api"

export const Create = () => {
  const navigate = useNavigate()

  const [addChart, { loading: loadingChart }] = useCreateChartMutation()
  const [addDimensions, { loading: loadingDimensions }] =
    useCreateDimensionsMutation()

  return (
    <Button
      onClick={() =>
        addChart({
          variables: { chart: { title: "New chart", min: 1, max: 4 } },
          onCompleted: ({ insert_charts_one }) => {
            invariant(
              insert_charts_one,
              "Something went wrong creating the chart."
            )

            const { id } = insert_charts_one

            addDimensions({
              variables: {
                dimensions: [
                  { title: "One", chartId: id },
                  { title: "Two", chartId: id },
                  { title: "Three", chartId: id },
                ],
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
