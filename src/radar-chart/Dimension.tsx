export const DIMENSION_OVERLAP = 10

type DimensionProps = {
  angle: number
  diagramWidth: number
}

export const Dimension = ({ angle, diagramWidth }: DimensionProps) => {
  return (
    <g className="origin-center" transform={`rotate(${angle})`}>
      <line
        x1={diagramWidth / 2}
        y1={diagramWidth / 2}
        x2={diagramWidth}
        y2={diagramWidth / 2}
        markerEnd="url(#dimension-head)"
        className="stroke-yellow-300"
      />
    </g>
  )
}

type MarkerProps = {
  size: number
}

export const DimensionMarker = ({ size }: MarkerProps) => (
  <marker
    id="dimension-head"
    markerWidth={size + 1}
    markerHeight={2 * size}
    orient="auto"
    refX={size}
    refY={size}
  >
    <path
      d={`M 0,0 L ${size},${size} L 0,${2 * size}`}
      strokeLinejoin="round"
      strokeLinecap="round"
      className="fill-transparent stroke-yellow-300"
    />
  </marker>
)
