import invariant from "invariant"
import { getPoint } from "./getPoint"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { Selection } from "./types"
import { getDimensionAngle } from "./utils"

const borderColor = {
  pink: "stroke-pink-700",
  blue: "stroke-blue-700",
}

const fill = {
  pink: "fill-pink-200",
  blue: "fill-blue-200",
}

export type Color = keyof typeof fill

type PlaneProps = {
  label: string
  selection: Selection
  color?: Color
}

export function Plane({ selection, label, color = "pink" }: PlaneProps) {
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
      className={`${fill[color]} ${borderColor[color]} opacity-50`}
    />
  )
}
