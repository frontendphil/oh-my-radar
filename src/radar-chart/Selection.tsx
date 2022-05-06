import { Plane } from "./Plane"
import { useDimensions } from "./RadarContext"
import { Slots } from "./Slots"
import { Step } from "./Step"
import { Colors, SelectionState } from "./types"

type AvailableColors = keyof typeof colors

type Props = {
  name: string
  value?: SelectionState
  color?: AvailableColors
  active?: boolean
  onChange?: (value: SelectionState) => void
}

export function Selection({
  name,
  value = {},
  color = Colors.pink,
  active = false,
  onChange,
}: Props) {
  const dimensions = useDimensions()

  if (dimensions.length === 0) {
    return null
  }

  const allValuesSelected = dimensions.every(({ id }) => value[id] != null)

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

      <Slots groupRole="radiogroup">
        {({ id, title }, { x, y, step }) => (
          <Step
            key={step}
            role={active ? "radio" : "presentation"}
            aria-label={`${title} - ${step}`}
            aria-checked={value[id] === step}
            x={x}
            y={y}
            className={`cursor-pointer ${
              value[id] === step ? circle.selected : "fill-transparent"
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
                  [id]: step,
                })
              }
            }}
          />
        )}
      </Slots>
    </>
  )
}

type ColorConfiguration = {
  fill: string
  stroke: string
}

export const getSelectionColor = (color: Colors): ColorConfiguration =>
  colors[color].plane

const colors = {
  [Colors.pink]: {
    plane: {
      fill: "fill-pink-200",
      stroke: "stroke-pink-700",
    },
    circle: {
      hover: "hover:fill-pink-500",
      selected: "fill-pink-500",
    },
  },
  [Colors.blue]: {
    plane: {
      fill: "fill-blue-200",
      stroke: "stroke-blue-700",
    },
    circle: { hover: "hover:fill-blue-500", selected: "fill-blue-500" },
  },
  [Colors.green]: {
    plane: {
      fill: "fill-emerald-200",
      stroke: "stroke-emerald-700",
    },
    circle: { hover: "hover:fill-emerald-500", selected: "fill-emerald-500" },
  },
  [Colors.purple]: {
    plane: {
      fill: "fill-purple-200",
      stroke: "stroke-purple-700",
    },
    circle: { hover: "hover:fill-purple-500", selected: "fill-purple-500" },
  },
  [Colors.yellow]: {
    plane: {
      fill: "fill-yellow-200",
      stroke: "stroke-yellow-700",
    },
    circle: { hover: "hover:fill-yellow-500", selected: "fill-yellow-500" },
  },
}
