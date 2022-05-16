import { DIMENSION_OVERLAP } from "./Dimension"
import { getDimensionAngle } from "./getDimensionAngle"
import { getPoint } from "./getPoint"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { Text } from "./Text"

export const DimensionLabels = () => {
  const dimensions = useDimensions()
  const diagramWidth = useDiagramWidth()
  const range = useRange()

  const [, max] = range

  return (
    <>
      {dimensions.map(({ id, title }, index) => {
        const { x, y } = getPoint({
          diagramWidth: diagramWidth + 2 * DIMENSION_OVERLAP + 40,
          range,
          value: max,
          angle: getDimensionAngle(dimensions, index),
        })

        return (
          <Text key={id} id={id} x={x} y={y}>
            {title}
          </Text>
        )
      })}
    </>
  )
}
