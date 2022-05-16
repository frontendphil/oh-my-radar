import invariant from "invariant"
import { getDimensionAngle } from "./getDimensionAngle"
import { getPoint } from "./getPoint"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { SelectionState } from "./types"

type PlaneProps = {
  label: string
  selection: SelectionState
  stroke: string
}

export function Plane({ selection, label, stroke }: PlaneProps) {
  const diagramWidth = useDiagramWidth()
  const range = useRange()
  const dimensions = useDimensions()

  const [start, ...points] = dimensions.map(({ id }, index) => {
    const value = selection[id]

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

  const d = `M ${start.x},${start.y} ${points
    .map(({ x, y }) => `L ${x},${y}`)
    .join(" ")} z`

  return (
    <path
      role="figure"
      aria-label={label}
      d={d}
      strokeWidth={3}
      className={`pointer-events-none fill-transparent  transition-all ${stroke}`}
    />
  )
}
