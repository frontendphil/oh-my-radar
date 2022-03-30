import invariant from "invariant"
import { getPoint } from "./getPoint"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { Selection } from "./types"
import { getDimensionAngle } from "./utils"

type PlaneProps = {
  label: string
  selection: Selection
  fill: string
  stroke: string
}

export function Plane({ selection, label, fill, stroke }: PlaneProps) {
  const diagramWidth = useDiagramWidth()
  const range = useRange()
  const dimensions = useDimensions()

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

  const d = `M ${start.x},${start.y} ${points
    .map(({ x, y }) => `L ${x},${y}`)
    .join(" ")} z`

  return (
    <path
      role="figure"
      aria-label={label}
      d={d}
      className={`pointer-events-none opacity-50 ${fill} ${stroke}`}
    />
  )
}
