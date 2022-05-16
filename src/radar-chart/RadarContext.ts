import { createContext, useContext } from "react"
import { DimensionDescriptor, Range } from "./types"

type Context = {
  diagramWidth: number
  range: Range
  dimensions: DimensionDescriptor[]
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

export const useDimensions = (): DimensionDescriptor[] => {
  const { dimensions } = useContext(RadarContext)

  return dimensions
}
