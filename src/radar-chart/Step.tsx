import { SVGAttributes } from "react"
import { Colors } from "./types"

export const STEP_RADIUS = 5

export type AvailableColors = keyof typeof colors

type Props = Omit<SVGAttributes<SVGCircleElement>, "cx" | "cy" | "r"> & {
  x: number
  y: number
  color?: AvailableColors
  selected?: boolean
  disabled?: boolean
}

export const Step = ({
  x,
  y,
  color,
  className,
  selected,
  disabled,
  ...rest
}: Props) => (
  <circle
    role="radio"
    aria-checked={selected}
    cx={x}
    cy={y}
    r={STEP_RADIUS}
    className={`stroke-2 transition-all ${className ?? ""} ${resolveColor(
      selected,
      color
    )} ${
      disabled ? "pointer-events-none" : "pointer-events-auto cursor-pointer"
    }`}
    {...rest}
  />
)

const resolveColor = (selected?: boolean, color?: AvailableColors) => {
  if (!color) {
    return "fill-slate-100 stroke-slate-400 dark:fill-slate-300 dark:stroke-slate-600"
  }

  if (selected) {
    return colors[color].selected
  }

  return `fill-slate-100 stroke-slate-400 dark:fill-slate-300 dark:stroke-slate-600 ${colors[color].hover}`
}

export const getSelectionColor = (color: Colors): string =>
  colors[color].selected

const colors = {
  [Colors.pink]: {
    selected:
      "stroke-pink-400 fill-pink-100 dark:stroke-pink-600 dark:fill-pink-300",
    hover:
      "hover:stroke-pink-400 hover:fill-pink-100 dark:hover:stroke-pink-600 dark:hover:fill-pink-300",
  },
  [Colors.blue]: {
    selected:
      "stroke-blue-400 fill-blue-100 dark:stroke-blue-600 dark:fill-blue-300",
    hover:
      "hover:stroke-blue-400 hover:fill-blue-100 dark:hover:stroke-blue-600 dark:hover:fill-blue-300",
  },
  [Colors.green]: {
    selected:
      "stroke-emerald-400 fill-emerald-100 dark:stroke-emerald-600 dark:fill-emerald-300",
    hover:
      "hover:stroke-emerald-400 hover:fill-emerald-100 dark:hover:stroke-emerald-600 dark:hover:fill-emerald-300",
  },
  [Colors.purple]: {
    selected:
      "fill-purple-100 stroke-purple-400 dark:stroke-purple-600 dark:fill-purple-300",
    hover:
      "hover:fill-purple-100 hover:stroke-purple-400 dark:hover:stroke-purple-600 dark:hover:fill-purple-300",
  },
  [Colors.yellow]: {
    selected:
      "stroke-yellow-400 fill-yellow-100 dark:fill-yellow-300 dark:stroke-yellow-600",
    hover:
      "hover:stroke-yellow-400 hover:fill-yellow-100 dark:hover:stroke-yellow-600 dark:hover:fill-yellow-300",
  },
  [Colors.yellow]: {
    selected:
      "stroke-yellow-400 fill-yellow-100 dark:fill-yellow-300 dark:stroke-yellow-600",
    hover:
      "hover:stroke-yellow-400 hover:fill-yellow-100 dark:hover:stroke-yellow-600 dark:hover:fill-yellow-300",
  },
}
