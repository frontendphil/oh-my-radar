import { ReactNode } from "react"
import { getDimensionAngle } from "./getDimensionAngle"
import { getPoint } from "./getPoint"
import { getStepsFromRange } from "./getStepsFromRange"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { DimensionDescriptor } from "./types"

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

  const steps = getStepsFromRange(range)

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
