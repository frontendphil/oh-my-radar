import { Color, Plane } from "./Plane"
import { useDimensions } from "./RadarContext"
import { Slots } from "./Slots"
import { Selection as SelectionValue } from "./types"

type Props = {
  name: string
  value: SelectionValue
  color?: Color
  onChange?: (value: SelectionValue) => void
}

export function Selection({ name, value, color, onChange }: Props) {
  const dimensions = useDimensions()

  if (dimensions.length === 0) {
    return null
  }

  const allValuesSelected = dimensions.every(
    (dimension) => value[dimension] != null
  )

  return (
    <>
      <Slots>
        {(dimension, { x, y, step }) => (
          <circle
            key={step}
            role="radio"
            aria-label={`${dimension} - ${step}`}
            aria-checked={value[dimension] === step}
            cx={x}
            cy={y}
            r={5}
            className="cursor-pointer fill-transparent stroke-transparent hover:fill-pink-500"
            onClick={() => {
              if (onChange) {
                onChange({
                  ...value,
                  [dimension]: step,
                })
              }
            }}
          />
        )}
      </Slots>

      {allValuesSelected && (
        <Plane label={name} selection={value} color={color} />
      )}
    </>
  )
}
