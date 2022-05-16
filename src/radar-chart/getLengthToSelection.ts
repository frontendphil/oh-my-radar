import { Range } from "./types"

export const getLengthToSelection = (
  diagramWidth: number,
  range: Range,
  value: number
): number => {
  const [, max] = range

  const lineLength = diagramWidth / 2

  return lineLength * (value / max)
}
