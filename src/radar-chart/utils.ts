import { Range } from "./types"

export const getDimensionAngle = (
  dimensions: unknown[],
  index: number
): number => {
  const angle = 360 / dimensions.length
  const angleOffset = angle / 2

  return -90 + angleOffset + angle * index
}

export const createRange = ([lower, upper]: Range): number[] => {
  const result = []

  for (let i = lower; i <= upper; i++) {
    result.push(i)
  }

  return result
}
