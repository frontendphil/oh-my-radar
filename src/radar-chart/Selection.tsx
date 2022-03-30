import { Plane } from "./Plane"
import { useDimensions } from "./RadarContext"
import { Slots } from "./Slots"
import { Step } from "./Step"
import { Selection as SelectionValue } from "./types"

const colors = {
  pink: {
    plane: {
      fill: "fill-pink-200",
      stroke: "stroke-pink-700",
    },
    circle: {
      hover: "hover:fill-pink-500",
      selected: "fill-pink-500",
    },
  },
  blue: {
    plane: {
      fill: "fill-blue-200",
      stroke: "stroke-blue-700",
    },
    circle: { hover: "hover:fill-blue-500", selected: "fill-blue-500" },
  },
}

type Props = {
  name: string
  value?: SelectionValue
  color?: keyof typeof colors
  active?: boolean
  onChange?: (value: SelectionValue) => void
}

export function Selection({
  name,
  value = {},
  color = "pink",
  active = false,
  onChange,
}: Props) {
  const dimensions = useDimensions()

  if (dimensions.length === 0) {
    return null
  }

  const allValuesSelected = dimensions.every(
    (dimension) => value[dimension] != null
  )

  const { circle, plane } = colors[color]

  return (
    <>
      {allValuesSelected && (
        <Plane
          label={name}
          selection={value}
          fill={plane.fill}
          stroke={plane.stroke}
        />
      )}

      <Slots>
        {(dimension, { x, y, step }) => (
          <Step
            key={step}
            role={active ? "radio" : "presentation"}
            aria-label={`${dimension} - ${step}`}
            aria-checked={value[dimension] === step}
            x={x}
            y={y}
            className={`cursor-pointer ${
              value[dimension] === step ? circle.selected : "fill-transparent"
            } stroke-transparent ${circle.hover} ${
              active ? "pointer-events-auto" : "pointer-events-none"
            }`}
            onClick={() => {
              if (!active) {
                return
              }

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
    </>
  )
}
