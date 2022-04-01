import { getStepsFromRange } from "./getStepsFromRange"
import { Range } from "./types"

export const getLengthToSelection = (
  diagramWidth: number,
  range: Range,
  value: number
): number => {
  const steps = getStepsFromRange(range)
  const lineLength = diagramWidth / 2

  const sectionWidth = lineLength / steps.length

  return sectionWidth * (steps.indexOf(value) + 1)
}
