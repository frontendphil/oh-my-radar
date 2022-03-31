import { useEffect, useState } from "react"
import { Colors } from "./configuration"
import { Dimensions } from "./Dimensions"
import { Input } from "./form-controls"

import {
  RadarChart,
  Selection,
  Range,
  SelectionState,
  SelectionDescriptor,
} from "./radar-chart"
import { Selections } from "./Selections"

type ChartState = {
  [selection: string]: SelectionState
}

export const App = () => {
  const [title, setTitle] = useState("Test")
  const [dimensions, setDimensions] = useState<string[]>([
    "One",
    "Two",
    "Three",
  ])
  const [[min, max], setRange] = useState<Range>([1, 4])
  const [chartState, setChartState] = useState<ChartState>({})

  const size = useAutoResize()

  const [activeSelection, setActiveSelection] = useState<string>("john")
  const [selectionDescriptors, setSelectionDescriptors] = useState<
    SelectionDescriptor[]
  >([{ id: "john", title: "john", color: Colors.blue }])

  return (
    <div className="grid grid-cols-2">
      <div className="m-24">
        <RadarChart
          title={title}
          dimensions={dimensions}
          range={[min, max]}
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

      <div className="mt-24 mr-24 flex flex-col gap-4">
        <Input label="Title" value={title} onChange={setTitle} />

        <Selections
          selectionDescriptors={selectionDescriptors}
          activeSelection={activeSelection}
          onAdd={(selectionDescriptor) =>
            setSelectionDescriptors([
              ...selectionDescriptors,
              selectionDescriptor,
            ])
          }
          onChange={(updatedSelectionDescriptor) =>
            setSelectionDescriptors(
              selectionDescriptors.map((selectionDescriptor) => {
                if (selectionDescriptor.id === updatedSelectionDescriptor.id) {
                  return updatedSelectionDescriptor
                }

                return selectionDescriptor
              })
            )
          }
          onActivate={setActiveSelection}
        />

        <Dimensions
          dimensions={dimensions}
          onAdd={(dimension) => setDimensions([...dimensions, dimension])}
          onRemove={(dimension) =>
            setDimensions(
              dimensions.filter(
                (currentDimension) => currentDimension !== dimension
              )
            )
          }
        />

        <Input
          type="number"
          label="Min value"
          value={min.toString()}
          onChange={(value) =>
            setRange([Math.min(parseInt(value, 10), max - 1), max])
          }
        />

        <Input
          type="number"
          label="Max value"
          value={max.toString()}
          onChange={(value) =>
            setRange([min, Math.max(parseInt(value, 10), min + 2)])
          }
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
