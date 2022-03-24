import { Range } from "./types"
import { createRange } from "./utils"

export const getLengthToSelection = (
  diagramWidth: number,
  range: Range,
  value: number
): number => {
  const steps = createRange(range)
  const lineLength = diagramWidth / 2

  const sectionWidth = lineLength / steps.length

  return sectionWidth * (steps.indexOf(value) + 1)
}
