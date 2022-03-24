export type Range = [lower: number, upper: number]

export type Selection<Dimension extends string> = {
  [key in Dimension]?: number
}
