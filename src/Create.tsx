import invariant from "invariant"
import { useNavigate } from "react-router-dom"
import { Button } from "./form-controls"
import { useCreateChartMutation } from "./__generated__/api"

export const Create = () => {
  const navigate = useNavigate()

  const [addChart, { loading }] = useCreateChartMutation()

  return (
    <Button
      onClick={() =>
        addChart({
          variables: { chart: { title: "New chart" } },
          onCompleted: ({ insert_charts_one }) => {
            invariant(
              insert_charts_one,
              "Something went wrong creating the chart."
            )

            const { id } = insert_charts_one

            navigate(`/admin/${id}`)
          },
        })
      }
    >
      {loading ? "Creating your chart..." : "Create new chart"}
    </Button>
  )
}
