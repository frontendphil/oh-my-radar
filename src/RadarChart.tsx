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
  const [selectedValues, setSelectedValues] = useState<number[]>([])

  return (
    <>
      {scale.map((value) => (
        <circle
          key={value}
          role="checkbox"
          aria-label={`${title} - ${value}`}
          aria-checked={selectedValues.includes(value)}
          onClick={() => setSelectedValues([...selectedValues, value])}
        />
      ))}
    </>
  )
}
