import { useState } from "react"

type Props = {
  title: string
  dimensions: string[]
  scale: number[]
}

export const RadarChart = ({ title, dimensions, scale }: Props) => (
  <svg role="figure" aria-label={title}>
    {dimensions.map((dimension) => (
      <Dimension key={dimension} title={dimension} scale={scale} />
    ))}
  </svg>
)

type DimensionProps = {
  title: string
  scale: number[]
}

const Dimension = ({ scale, title }: DimensionProps) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null)

  return (
    <>
      <path role="radiogroup" aria-label={title} />
      {scale.map((value) => (
        <circle
          key={value}
          role="radio"
          aria-label={`${title} - ${value}`}
          aria-checked={selectedValue === value}
          cx={5}
          cy={5}
          r={5}
          className="fill-slate-700"
          onClick={() => setSelectedValue(value)}
        />
      ))}
    </>
  )
}
