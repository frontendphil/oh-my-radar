import { Range } from "./types"
import { createRange } from "./utils"

type GetPointsOptions = {
  range: Range
  diagramWidth: number
  value: number
  angle: number
}

type Point = {
  x: number
  y: number
}

export function getPoint({
  angle,
  value,
  range,
  diagramWidth,
}: GetPointsOptions): Point {
  const beta = 90 - angle

  const length = getLengthToSelection(diagramWidth, range, value)

  const x = Math.sin(beta) * length
  const y = Math.sin(angle) * length

  return { x, y }
}

const getLengthToSelection = (
  diagramWidth: number,
  range: Range,
  value: number
): number => {
  const steps = createRange(range)
  const lineLength = diagramWidth / 2

  return (lineLength / steps.length) * value
}
