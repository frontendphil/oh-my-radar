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

  return (
    <>
      {allValuesSelected && (
        <Plane label={name} selection={value} stroke={colors[color]} />
      )}

      <Slots groupRole="radiogroup">
        {({ id, title }, { x, y, step }) => {
          if (active) {
            return (
              <Step
                key={step}
                aria-label={`${title} - ${step}`}
                x={x}
                y={y}
                selected={value[id] === step}
                color={color}
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
            )
          }

          if (value[id] !== step) {
            return
          }

          return (
            <Step
              disabled
              selected
              key={step}
              aria-label={`${title} - ${step}`}
              x={x}
              y={y}
              color={color}
            />
          )
        }}
      </Slots>
    </>
  )
}

const colors = {
  [Colors.pink]: "stroke-pink-400 dark:stroke-pink-600",
  [Colors.blue]: "stroke-blue-400 dark:stroke-blue-600",
  [Colors.green]: "stroke-emerald-400 dark:stroke-emerald-600",
  [Colors.purple]: "stroke-purple-400 dark:stroke-purple-600",
  [Colors.yellow]: "stroke-yellow-400 dark:stroke-yellow-600",
}
