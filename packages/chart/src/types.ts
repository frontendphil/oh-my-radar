export enum Colors {
  pink = "pink",
  blue = "blue",
  green = "green",
  purple = "purple",
  yellow = "yellow",
}

export type Range = [lower: number, upper: number]

export type SelectionState = {
  [dimension: string]: number
}

export type Participant = {
  id: string
  name: string
  color: Colors
}

export type DimensionDescriptor = {
  id: string
  title: string
  deleted?: boolean
}
