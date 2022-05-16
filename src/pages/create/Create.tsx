import invariant from "invariant"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PrimaryButton } from "../../form-controls"
import { View } from "../../layout"
import { Colors, RadarChart, Selection } from "../../radar-chart"
import { useCreateChartMutation, useCreateDimensionsMutation } from "./api"

export const Create = () => {
  const navigate = useNavigate()

  const [addChart, { loading: loadingChart }] = useCreateChartMutation()
  const [addDimensions, { loading: loadingDimensions }] =
    useCreateDimensionsMutation()

  const loading = loadingChart || loadingDimensions

  return (
    <View>
      <div className="flex h-screen w-full flex-col items-center justify-center gap-12">
        <Demo />

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
          {loading ? "Creating your chart..." : "Create new chart"}
        </PrimaryButton>
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

const useRandomSelection = () => {
  const [selection, setSelection] = useState({})

  useEffect(() => {
    const randomizeSelection = () => {
      setSelection({
        acceleration: Math.floor(Math.random() * 5 + 1),
        displacement: Math.floor(Math.random() * 5 + 1),
        horsepower: Math.floor(Math.random() * 5 + 1),
        mpg: Math.floor(Math.random() * 5 + 1),
        weight: Math.floor(Math.random() * 5 + 1),
      })
    }

    randomizeSelection()

    const interval = setInterval(randomizeSelection, 5000)

    return () => clearInterval(interval)
  }, [])

  return selection
}

const Demo = () => {
  const john = useRandomSelection()
  const jane = useRandomSelection()

  return (
    <RadarChart
      title="Demo"
      range={[1, 5]}
      dimensions={[
        { id: "acceleration", title: "Acceleration" },
        { id: "displacement", title: "Displacement" },
        { id: "horsepower", title: "Horsepower" },
        { id: "mpg", title: "MPG" },
        { id: "weight", title: "Weight" },
      ]}
    >
      <Selection name="Jane" value={jane} />
      <Selection name="John" color={Colors.green} value={john} />
    </RadarChart>
  )
}
