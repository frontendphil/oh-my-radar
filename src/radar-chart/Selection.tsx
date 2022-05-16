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
        <Plane label={name} selection={value} stroke={plane} />
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
            className={`cursor-pointer stroke-2 transition-all ${
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

export const getSelectionColor = (color: Colors): string => colors[color].plane

const colors = {
  [Colors.pink]: {
    plane: "stroke-pink-400 dark:stroke-pink-600",

    circle: {
      selected:
        "stroke-pink-400 fill-pink-100 dark:stroke-pink-600 dark:fill-pink-300",
      hover:
        "hover:stroke-pink-400 hover:fill-pink-100 dark:hover:stroke-pink-600 dark:hover:fill-pink-300",
    },
  },
  [Colors.blue]: {
    plane: "stroke-blue-400 dark:stroke-blue-600",

    circle: {
      selected:
        "stroke-blue-400 fill-blue-100 dark:stroke-blue-600 dark:fill-blue-300",
      hover:
        "hover:stroke-blue-400 hover:fill-blue-100 dark:hover:stroke-blue-600 dark:hover:fill-blue-300",
    },
  },
  [Colors.green]: {
    plane: "stroke-emerald-400 dark:stroke-emerald-600",

    circle: {
      selected:
        "stroke-emerald-400 fill-emerald-100 dark:stroke-emerald-600 dark:fill-emerald-300",
      hover:
        "hover:stroke-emerald-400 hover:fill-emerald-100 dark:hover:stroke-emerald-600 dark:hover:fill-emerald-300",
    },
  },
  [Colors.purple]: {
    plane: "stroke-purple-400 dark:stroke-purple-600",

    circle: {
      selected:
        "fill-purple-100 stroke-purple-400 dark:stroke-purple-600 dark:fill-purple-300",
      hover:
        "hover:fill-purple-100 hover:stroke-purple-400 dark:hover:stroke-purple-600 dark:hover:fill-purple-300",
    },
  },
  [Colors.yellow]: {
    plane: "stroke-yellow-400 dark:stroke-yellow-600",

    circle: {
      selected:
        "stroke-yellow-400 fill-yellow-100 dark:fill-yellow-300 dark:stroke-yellow-600",
      hover:
        "hover:stroke-yellow-400 hover:fill-yellow-100 dark:hover:stroke-yellow-600 dark:hover:fill-yellow-300",
    },
  },
}
