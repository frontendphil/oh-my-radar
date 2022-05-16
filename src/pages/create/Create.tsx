import invariant from "invariant"
import { useNavigate } from "react-router-dom"
import { PrimaryButton } from "../../form-controls"
import { View } from "../../layout"
import { useCreateChartMutation, useCreateDimensionsMutation } from "./api"
import { Demo } from "./Demo"

export const Create = () => {
  const navigate = useNavigate()

  const [addChart, { loading: loadingChart }] = useCreateChartMutation()
  const [addDimensions, { loading: loadingDimensions }] =
    useCreateDimensionsMutation()

  const loading = loadingChart || loadingDimensions

  return (
    <View>
      <div className="grid h-screen w-full grid-cols-2 ">
        <div className="p-24">
          <Demo />
        </div>

        <div className="flex items-center justify-center">
          <PrimaryButton
            disabled={loading}
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
            {loading ? "Creating your chart..." : "Create your own chart"}
          </PrimaryButton>
        </div>
      </div>
    </View>
  )
}

export const defaultDimensions = (chartId: string) => [
  { title: "One", chartId },
  { title: "Two", chartId },
  { title: "Three", chartId },
]

export const defaultChart = () => ({ title: "New chart", min: 1, max: 4 })
