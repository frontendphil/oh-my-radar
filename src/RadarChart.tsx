import { useState } from "react"

type Range = [lower: number, upper: number]

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

  const angle = 360 / dimensions.length
  const angleOffset = angle / 2

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

      {dimensions.map((dimension, index) => (
        <g
          key={dimension}
          className="origin-center"
          transform={`rotate(${-90 + angleOffset + angle * index})`}
        >
          <Dimension
            title={dimension}
            range={range}
            value={selectedValues[dimension]}
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
  onChange: (value: number) => void
}

const Dimension = ({ range, title, value, onChange }: DimensionProps) => {
  const steps = createRange(range)
  const stepSize = 50 / steps.length

  return (
    <>
      <line
        role="radiogroup"
        aria-label={title}
        x1="50%"
        y1="50%"
        x2="100%"
        y2="50%"
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
          className="fill-slate-500 stroke-transparent cursor-pointer hover:fill-pink-500"
          onClick={() => onChange(step)}
        />
      ))}
    </>
  )
}

const createRange = ([lower, upper]: Range): number[] => {
  const result = []

  for (let i = lower; i <= upper; i++) {
    result.push(i)
  }

  console.log(result)

  return result
}
