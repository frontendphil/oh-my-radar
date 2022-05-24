import invariant from "invariant"
import { useNavigate } from "react-router-dom"
import { PrimaryButton } from "../../form-controls"
import { View } from "../../layout"
import {
  useCreateChartMutation,
  useCreateDimensionsMutation,
  useStatsQuery,
} from "./api"
import { Demo } from "./Demo"

export const Create = () => {
  const navigate = useNavigate()

  const { data, loading } = useStatsQuery()

  const [addChart, { loading: creatingChart }] = useCreateChartMutation()
  const [addDimensions, { loading: creatingDimensions }] =
    useCreateDimensionsMutation()

  if (loading) {
    return null
  }

  const creating = creatingChart || creatingDimensions

  return (
    <View>
      <div className="grid h-screen w-full grid-rows-2 md:grid-cols-2 md:grid-rows-1 ">
        <div className="flex items-center p-12 md:p-24">
          <Demo />
        </div>

        <div className="flex h-full flex-col items-center justify-center gap-24">
          <PrimaryButton
            disabled={creating}
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
            {creating ? "Creating your chart..." : "Create your own chart"}
          </PrimaryButton>

          <div className="text-xs uppercase">
            {`${data?.participants_aggregate.aggregate?.count} people have participated in ${data?.charts_aggregate.aggregate?.count} charts.`}
          </div>
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
