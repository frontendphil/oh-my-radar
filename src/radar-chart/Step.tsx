import { SVGAttributes } from "react"

export const STEP_RADIUS = 5

type Props = Omit<SVGAttributes<SVGCircleElement>, "cx" | "cy" | "r"> & {
  x: number
  y: number
}

export const Step = (props: Props) => <circle r={STEP_RADIUS} {...props} />
