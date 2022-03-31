import { ReactNode } from "react"
import { getPoint } from "./getPoint"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { DimensionDescriptor } from "./types"
import { createRange, getDimensionAngle } from "./utils"

type Slot = {
  x: number
  y: number
  step: number
}

type Props = {
  children: (dimension: DimensionDescriptor, slot: Slot) => ReactNode
}

export const Slots = ({ children }: Props) => {
  const diagramWidth = useDiagramWidth()
  const range = useRange()
  const dimensions = useDimensions()

  const steps = createRange(range)

  return (
    <>
      {dimensions.map((dimension, index) => {
        const angle = getDimensionAngle(dimensions, index)

        return steps.map((step) => {
          const point = getPoint({ diagramWidth, range, value: step, angle })

          return children(dimension, { ...point, step })
        })
      })}
    </>
  )
}
