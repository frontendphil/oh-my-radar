import { HTMLAttributes, useState } from "react"
import { v4 } from "uuid"
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

  const [newDimension, setNewDimension] = useState("")

  return (
    <div className="grid grid-cols-2">
      <RadarChart title={title} dimensions={dimensions} range={[min, max]} />

      <div>
        <Input label="Title" value={title} onChange={setTitle} />

        {dimensions.length > 0 && (
          <ul aria-label="Dimensions">
            {dimensions.map((dimension) => (
              <li aria-label={dimension} key={dimension}>
                {dimension}

                <button
                  aria-label={`Remove dimension "${dimension}"`}
                  onClick={() =>
                    setDimensions((currentDimensions) =>
                      currentDimensions.filter(
                        (currentDimension) => currentDimension !== dimension
                      )
                    )
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <Input
          label="Add dimension"
          value={newDimension}
          onChange={setNewDimension}
          onKeyUp={(event) => {
            if (event.key !== "Enter") {
              return
            }

            if (newDimension.trim() === "") {
              return
            }

            if (dimensions.includes(newDimension)) {
              return
            }

            setDimensions([...dimensions, newDimension])
            setNewDimension("")
          }}
        />

        <button
          disabled={dimensions.includes(newDimension)}
          onClick={() => setDimensions([...dimensions, newDimension])}
        >{`Add dimension "${newDimension}"`}</button>

        <Input
          type="number"
          label="Min value"
          value={min.toString()}
          onChange={(value) => setRange([parseInt(value, 10), max])}
        />

        <Input
          type="number"
          label="Max value"
          value={max.toString()}
          onChange={(value) => setRange([min, parseInt(value, 10)])}
        />
      </div>
    </div>
  )
}

type InputProps = Omit<HTMLAttributes<HTMLInputElement>, "onChange"> & {
  type?: string
  label: string
  value?: string
  onChange?: (newValue: string) => void
}

const Input = ({ label, value, onChange, ...rest }: InputProps) => {
  const [id] = useState(v4)

  return (
    <>
      <label
        htmlFor={id}
        className="uppercase text-sm font-bold block text-slate-500"
      >
        {label}
      </label>
      <input
        type="text"
        {...rest}
        className="border border-slate-400 rounded px-2 py-2"
        id={id}
        value={value}
        onChange={(event) => {
          if (!onChange) {
            return
          }

          onChange(event.target.value)
        }}
      />
    </>
  )
}
