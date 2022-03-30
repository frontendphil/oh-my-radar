import { SVGAttributes } from "react"

export const STEP_RADIUS = 5

type Props = Omit<SVGAttributes<SVGCircleElement>, "cx" | "cy" | "r"> & {
  x: number
  y: number
}

export const Step = ({ x, y, ...rest }: Props) => (
  <circle x={x} y={y} r={STEP_RADIUS} {...rest} />
)
