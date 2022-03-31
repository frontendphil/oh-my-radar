import { Colors } from "../configuration"

export type Range = [lower: number, upper: number]

export type SelectionState = {
  [dimension: string]: number
}

export type SelectionDescriptor = {
  id: string
  title: string
  color: Colors
}
