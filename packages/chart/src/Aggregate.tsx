import { getDimensionAngle } from "./getDimensionAngle"
import { getPoint } from "./getPoint"
import { Plane } from "./Plane"
import { useDiagramWidth, useDimensions, useRange } from "./RadarContext"
import { Step } from "./Step"
import { Colors, SelectionState } from "./types"

type Props = {
  name: string
  value: SelectionState
}

export const Aggregate = ({ name, value }: Props) => {
  const dimensions = useDimensions()
  const diagramWidth = useDiagramWidth()
  const range = useRange()

  return (
    <>
      <Plane
        label={name}
        selection={value}
        color={Colors.green}
        strokeDasharray="4"
      />

      {dimensions.map(({ id }, index) => {
        const angle = getDimensionAngle(dimensions, index)

        const point = getPoint({
          diagramWidth,
          range,
          value: value[id],
          angle,
        })

        return (
          <Step
            disabled
            selected
            color={Colors.green}
            key={id}
            x={point.x}
            y={point.y}
          />
        )
      })}
    </>
  )
}
