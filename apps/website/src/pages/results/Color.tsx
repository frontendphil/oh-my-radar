import { HTMLAttributes, useId } from "react"
import { Colors, getSelectionColor } from "@radar/chart"

type ColorProps = HTMLAttributes<HTMLDivElement> & {
  color: Colors
  dashed?: boolean
}

export const Color = ({ color, dashed, ...rest }: ColorProps) => {
  return (
    <div {...rest}>
      <svg width={16} height={16}>
        <circle
          cx="50%"
          cy="50%"
          r={6}
          strokeDasharray={dashed ? "2" : undefined}
          className={`fill-transparent stroke-2 ${getSelectionColor(color)}`}
        />
      </svg>
    </div>
  )
}
