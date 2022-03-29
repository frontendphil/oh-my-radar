import { createContext, useContext, useEffect } from "react"
import { Range, Selection } from "./types"

export type UpdateOptions = {
  name: string
  value: Selection
  onChange?: (value: Selection) => void
}

type Context = {
  diagramWidth: number
  range: Range
  dimensions: string[]
  updateSelection: (options: UpdateOptions) => void
}

export const RadarContext = createContext<Context>({
  diagramWidth: 0,
  range: [0, 0],
  dimensions: [],
  updateSelection: () => {
    throw new Error('"updateSelection" not implemented.')
  },
})

export const useDiagramWidth = (): number => {
  const { diagramWidth } = useContext(RadarContext)

  return diagramWidth
}

export const useRange = (): Range => {
  const { range } = useContext(RadarContext)

  return range
}

export const useDimensions = (): string[] => {
  const { dimensions } = useContext(RadarContext)

  return dimensions
}

export const useSelection = ({
  name,
  value,
  onChange,
}: UpdateOptions): void => {
  const { updateSelection } = useContext(RadarContext)

  useEffect(
    () => updateSelection({ name, value, onChange }),
    [name, value, onChange]
  )
}
