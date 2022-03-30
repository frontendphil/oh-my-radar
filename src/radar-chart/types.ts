import { Colors } from "../configuration"

export type Range = [lower: number, upper: number]

export type Selection = {
  [dimension: string]: number
}

export type SelectionDescriptor = {
  title: string
  color: Colors
}
