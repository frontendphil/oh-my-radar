import invariant from "invariant"
import { getLengthToSelection } from "./getLengthToSelection"
import { Range } from "./types"

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

  invariant(
    !isNaN(length),
    `Could not compute length to value "${value}" with angle ${angle}° and range ${range}.`
  )

  const x = Math.sin(toRadians(beta)) * length
  const y = Math.sin(toRadians(angle)) * length

  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 }
}

const toRadians = (degrees: number): number => degrees * (Math.PI / 180)
