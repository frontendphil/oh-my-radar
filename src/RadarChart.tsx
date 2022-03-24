import { useState } from "react"

import { getPoint } from "./getPoint"
import { createRange, getDimensionAngle } from "./utils"
import { Range } from "./types"
import invariant from "invariant"

type Props<Dimension extends string> = {
  title: string
  dimensions: Dimension[]
  range: Range
}

type State<Dimension extends string> = {
  [key in Dimension]?: number
}

export function RadarChart<Dimension extends string>({
  title,
  dimensions,
  range,
}: Props<Dimension>) {
  const [selectedValues, setSelectedValues] = useState<State<Dimension>>({})

  const width = 500
  const height = 500

  const steps = createRange(range)
  const stepSize = 50 / steps.length

  return (
    <svg role="figure" aria-label={title} width={width} height={height}>
      <g>
        {steps.map((step, index) => (
          <circle
            key={step}
            className="stroke-slate-400 fill-transparent"
            cx="50%"
            cy="50%"
            r={`${stepSize * (index + 1)}%`}
          />
        ))}
      </g>

      {dimensions.length > 0 &&
        Object.keys(selectedValues).length === dimensions.length && (
          <g transform="rotate(90)">
            <Plane
              diagramWidth={width}
              selection={selectedValues}
              dimensions={dimensions}
              range={range}
            />
          </g>
        )}

      {dimensions.map((dimension, index) => (
        <g
          key={dimension}
          className="origin-center"
          transform={`rotate(${getDimensionAngle(dimensions, index)})`}
        >
          <Dimension
            title={dimension}
            range={range}
            value={selectedValues[dimension]}
            diagramWidth={width}
            onChange={(newValue) =>
              setSelectedValues((current) => ({
                ...current,
                [dimension]: newValue,
              }))
            }
          />
        </g>
      ))}
    </svg>
  )
}

type DimensionProps = {
  title: string
  range: Range
  value: number | undefined
  diagramWidth: number
  onChange: (value: number) => void
}

const Dimension = ({
  range,
  title,
  value,
  diagramWidth,
  onChange,
}: DimensionProps) => {
  const steps = createRange(range)
  const stepSize = 50 / steps.length

  return (
    <>
      <line
        role="radiogroup"
        aria-label={title}
        x1={diagramWidth / 2}
        y1={diagramWidth / 2}
        x2={diagramWidth}
        y2={diagramWidth / 2}
        className="stroke-slate-500"
      />

      {steps.map((step, index) => (
        <circle
          key={step}
          role="radio"
          aria-label={`${title} - ${step}`}
          aria-checked={value === step}
          cx={`${50 + (index + 1) * stepSize}%`}
          cy="50%"
          r={5}
          className={`${
            value === step ? "fill-pink-500" : "fill-slate-500"
          } stroke-transparent cursor-pointer hover:fill-pink-500`}
          onClick={() => onChange(step)}
        />
      ))}
    </>
  )
}

type PlaneProps<Dimension extends string> = {
  diagramWidth: number
  dimensions: Dimension[]
  selection: State<Dimension>
  range: Range
}

function Plane<Dimension extends string>({
  diagramWidth,
  range,
  selection,
  dimensions,
}: PlaneProps<Dimension>) {
  const [start, ...points] = dimensions.map((dimension, index) => {
    const value = selection[dimension]

    invariant(
      value != null,
      "To render a plane all dimensions must have a value."
    )

    return getPoint({
      diagramWidth,
      range,
      value,
      angle: getDimensionAngle(dimensions, index),
    })
  })

  const d = `M ${start.x},${start.y} ${points.map(
    ({ x, y }) => `L ${x},${y}`
  )} z`

  return <path d={d} />
}
