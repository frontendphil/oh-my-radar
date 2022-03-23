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

const Dimension = ({ scale, title }: DimensionProps) => (
  <>
    {scale.map((value) => (
      <circle key={value} role="checkbox" aria-label={`${title} - ${value}`} />
    ))}
  </>
)
