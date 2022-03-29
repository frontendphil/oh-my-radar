import invariant from "invariant"
import { getPoint } from "./getPoint"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { Selection } from "./types"
import { getDimensionAngle } from "./utils"

type PlaneProps = {
  selection: Selection
}

export function Plane({ selection }: PlaneProps) {
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

  return <path d={d} className="fill-pink-200 stroke-pink-700 opacity-50" />
}
