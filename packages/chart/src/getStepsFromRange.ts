import { Range } from "./types"

export const getStepsFromRange = ([lower, upper]: Range): number[] => {
  const result = []

  for (let i = lower; i <= upper; i++) {
    result.push(i)
  }

  return result
}
