import { ReactNode } from "react"
import { getDimensionAngle } from "./getDimensionAngle"
import { getPoint } from "./getPoint"
import { getStepsFromRange } from "./getStepsFromRange"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { Dimension } from "./types"

type Slot = {
  x: number
  y: number
  step: number
}

type Props = {
  groupRole?: string
  children: (dimension: Dimension, slot: Slot) => ReactNode
}

export const Slots = ({ children, groupRole }: Props) => {
  const diagramWidth = useDiagramWidth()
  const range = useRange()
  const dimensions = useDimensions()

  const steps = getStepsFromRange(range)

  return (
    <>
      {dimensions.map((dimension, index) => {
        const angle = getDimensionAngle(dimensions, index)

        return (
          <g key={dimension.id} role={groupRole} aria-labelledby={dimension.id}>
            {steps.map((step) => {
              const point = getPoint({
                diagramWidth,
                range,
                value: step,
                angle,
              })

              return children(dimension, { ...point, step })
            })}
          </g>
        )
      })}
    </>
  )
}
