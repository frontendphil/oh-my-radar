import { getPoint } from "./getPoint"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { Text } from "./Text"
import { getDimensionAngle } from "./utils"

export const DimensionLabels = () => {
  const dimensions = useDimensions()
  const diagramWidth = useDiagramWidth()
  const range = useRange()

  const [, max] = range

  return (
    <>
      {dimensions.map((dimension, index) => {
        const { x, y } = getPoint({
          diagramWidth,
          range,
          value: max,
          angle: getDimensionAngle(dimensions, index),
        })

        return (
          <Text key={dimension} x={x} y={y}>
            {dimension}
          </Text>
        )
      })}
    </>
  )
}
