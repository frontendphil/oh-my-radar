import { useEffect, useState } from "react"
import { ChartConfiguration, useConfiguration } from "./chart-configuration"
import { RadarChart, Selection, SelectionState, Colors } from "./radar-chart"

type ChartState = {
  [selection: string]: SelectionState
}

export const App = () => {
  const [chartState, setChartState] = useState<ChartState>({})
  const size = useAutoResize()
  const [activeSelection, setActiveSelection] = useState<string>("john")
  const [
    { title, dimensionDescriptors, selectionDescriptors, range },
    onChangeConfiguration,
  ] = useConfiguration({
    title: "Test",
    range: [1, 4],
    dimensionDescriptors: [
      { id: "one", title: "One" },
      { id: "two", title: "Two" },
      { id: "three", title: "Three" },
    ],
    selectionDescriptors: [{ id: "john", title: "john", color: Colors.blue }],
  })

  return (
    <div className="grid grid-cols-2">
      <div className="m-24">
        <RadarChart
          title={title}
          dimensions={dimensionDescriptors}
          range={range}
          size={size}
        >
          {selectionDescriptors.map(({ id, title, color }) => (
            <Selection
              key={id}
              active={activeSelection === id}
              name={title}
              value={chartState[id]}
              onChange={(value) =>
                setChartState({ ...chartState, [id]: value })
              }
              color={color}
            />
          ))}
        </RadarChart>
      </div>

      <div className="mt-24 mr-24">
        <ChartConfiguration
          activeSelectionId={activeSelection}
          configuration={{
            title,
            dimensionDescriptors,
            selectionDescriptors,
            range,
          }}
          onChange={onChangeConfiguration}
          onActivateSelection={setActiveSelection}
        />
      </div>
    </div>
  )
}

const useAutoResize = () => {
  const [size, setSize] = useState(window.innerWidth / 3)

  useEffect(() => {
    const callback = () => setSize(window.innerWidth / 3)

    window.addEventListener("resize", callback)

    return () => {
      window.removeEventListener("resize", callback)
    }
  }, [])

  return size
}
