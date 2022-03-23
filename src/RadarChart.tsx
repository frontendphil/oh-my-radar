import { useState } from "react"

type Props = {
  title: string
  dimensions: string[]
  scale: number[]
}

export const RadarChart = ({ title, dimensions, scale }: Props) => {
  const angle = 360 / dimensions.length
  const angleOffset = angle / 2

  const width = 500
  const height = 500

  return (
    <svg role="figure" aria-label={title} width={width} height={height}>
      {dimensions.map((dimension, index) => (
        <g
          key={dimension}
          className="origin-center"
          transform={`rotate(${-90 + angleOffset + angle * index})`}
        >
          <Dimension title={dimension} scale={scale} />
        </g>
      ))}
    </svg>
  )
}

type DimensionProps = {
  title: string
  scale: number[]
}

const Dimension = ({ scale, title }: DimensionProps) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null)

  const stepSize = 50 / scale.length

  return (
    <>
      <line
        role="radiogroup"
        aria-label={title}
        x1="50%"
        y1="50%"
        x2="100%"
        y2="50%"
        className="stroke-slate-700"
      />
      {scale.map((value, index) => (
        <circle
          key={value}
          role="radio"
          aria-label={`${title} - ${value}`}
          aria-checked={selectedValue === value}
          cx={`${50 + (index + 1) * stepSize}%`}
          cy="50%"
          r={5}
          className="fill-slate-700"
          onClick={() => setSelectedValue(value)}
        />
      ))}
    </>
  )
}
