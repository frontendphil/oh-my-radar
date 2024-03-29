import invariant from "invariant"
import { SVGAttributes } from "react"
import { getDimensionAngle } from "./getDimensionAngle"
import { getPoint } from "./getPoint"
import { useDimensions, useRange, useDiagramWidth } from "./RadarContext"
import { AvailableColors } from "./Step"
import { Colors, SelectionState } from "./types"

type PlaneProps = SVGAttributes<SVGPathElement> & {
  label: string
  selection: SelectionState
  color: AvailableColors
}

export function Plane({ selection, label, color, ...rest }: PlaneProps) {
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
      {...rest}
      role="figure"
      aria-label={label}
      d={d}
      strokeWidth={3}
      className={`pointer-events-none fill-transparent  transition-all ${colors[color]}`}
    />
  )
}

const colors = {
  [Colors.pink]: "stroke-pink-400 dark:stroke-pink-600",
  [Colors.blue]: "stroke-blue-400 dark:stroke-blue-600",
  [Colors.green]: "stroke-emerald-400 dark:stroke-emerald-600",
  [Colors.purple]: "stroke-purple-400 dark:stroke-purple-600",
  [Colors.yellow]: "stroke-yellow-400 dark:stroke-yellow-600",
}
