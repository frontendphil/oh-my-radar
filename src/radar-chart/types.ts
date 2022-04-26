export const enum Colors {
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

export type Dimension = {
  id: string
  title: string
}

export type NewDimension = Omit<Dimension, "id">
