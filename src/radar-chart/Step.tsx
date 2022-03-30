import { SVGAttributes } from "react"

export const STEP_RADIUS = 5

type Props = Omit<SVGAttributes<SVGCircleElement>, "cx" | "cy" | "r"> & {
  x: number
  y: number
  className?: string
}

export const Step = ({ x, y, className }: Props) => (
  <circle x={x} y={y} r={STEP_RADIUS} className={className} />
)
