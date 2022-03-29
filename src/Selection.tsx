import { Color, Plane } from "./Plane"
import { useDimensions, useSelection } from "./RadarContext"
import { Selection as SelectionValue } from "./types"

type Props = {
  name: string
  value: SelectionValue
  color?: Color
  onChange?: (value: SelectionValue) => void
}

export function Selection({ name, value, color, onChange }: Props) {
  useSelection({ name, value, onChange })

  const dimensions = useDimensions()

  if (dimensions.length === 0) {
    return null
  }

  const allValuesSelected = dimensions.every(
    (dimension) => value[dimension] != null
  )

  if (!allValuesSelected) {
    return null
  }

  return <Plane label={name} selection={value} color={color} />
}
