import { createContext, useContext } from "react"
import { Dimension, Range } from "./types"

type Context = {
  diagramWidth: number
  range: Range
  dimensions: Dimension[]
}

export const RadarContext = createContext<Context>({
  diagramWidth: 0,
  range: [0, 0],
  dimensions: [],
})

export const useDiagramWidth = (): number => {
  const { diagramWidth } = useContext(RadarContext)

  return diagramWidth
}

export const useRange = (): Range => {
  const { range } = useContext(RadarContext)

  return range
}

export const useDimensions = (): Dimension[] => {
  const { dimensions } = useContext(RadarContext)

  return dimensions
}
