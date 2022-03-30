import { useEffect, useState } from "react"
import { Dimensions } from "./Dimensions"
import { Input } from "./form-controls"

import { RadarChart, Selection, Range, SelectionValue } from "./radar-chart"

export const App = () => {
  const [title, setTitle] = useState("Test")
  const [dimensions, setDimensions] = useState<string[]>([
    "One",
    "Two",
    "Three",
  ])
  const [[min, max], setRange] = useState<Range>([1, 4])
  const [selection, setSelection] = useState<SelectionValue>({})

  const [size, setSize] = useState(window.innerWidth / 3)

  useEffect(() => {
    const callback = () => setSize(window.innerWidth / 3)

    window.addEventListener("resize", callback)

    return () => {
      window.removeEventListener("resize", callback)
    }
  }, [])

  return (
    <div className="grid grid-cols-2">
      <div className="m-24">
        <RadarChart
          title={title}
          dimensions={dimensions}
          range={[min, max]}
          width={size}
          height={size}
        >
          <Selection
            name="john"
            value={selection}
            onChange={setSelection}
            color="blue"
          />
        </RadarChart>
      </div>

      <div className="mt-24 mr-24 flex flex-col gap-4">
        <Input label="Title" value={title} onChange={setTitle} />

        <Dimensions
          dimensions={dimensions}
          onAdd={(dimension) => setDimensions([...dimensions, dimension])}
          onRemove={(dimension) =>
            setDimensions((currentDimensions) =>
              currentDimensions.filter(
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
