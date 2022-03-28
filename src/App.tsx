import { useState } from "react"
import { Dimensions } from "./Dimensions"
import { Input } from "./Input"

import { RadarChart } from "./RadarChart"
import { Range } from "./types"

export const App = () => {
  const [title, setTitle] = useState("Test")
  const [dimensions, setDimensions] = useState<string[]>([
    "One",
    "Two",
    "Three",
  ])
  const [[min, max], setRange] = useState<Range>([1, 4])

  return (
    <div className="grid grid-cols-2">
      <RadarChart title={title} dimensions={dimensions} range={[min, max]} />

      <div>
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
