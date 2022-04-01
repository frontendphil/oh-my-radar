import { ReactNode } from "react"
import { DimensionDescriptor, Range } from "./types"
import { RadarContext, useDiagramWidth, useRange } from "./RadarContext"
import { Slots } from "./Slots"
import { DimensionLabels } from "./DimensionLabels"
import { getLengthToSelection } from "./getLengthToSelection"
import { Step, STEP_RADIUS } from "./Step"
import { getStepsFromRange } from "./getStepsFromRange"
import { getDimensionAngle } from "./getDimensionAngle"

type Props = {
  title: string
  dimensions: DimensionDescriptor[]
  range: Range
  size?: number
  children: ReactNode
}

export function RadarChart({
  title,
  dimensions,
  range,
  size = 500,
  children,
}: Props) {
  const padding = STEP_RADIUS

  return (
    <RadarContext.Provider
      value={{ diagramWidth: size - 2 * STEP_RADIUS, dimensions, range }}
    >
      <div className="relative">
        <div
          style={{
            position: "absolute",
            left: size / 2,
            top: size / 2,
          }}
        >
          <DimensionLabels />
        </div>

        <svg
          className="absolute"
          role="figure"
          aria-label={title}
          width={size}
          height={size}
        >
          <g
            x={padding}
            y={padding}
            width={size - 2 * STEP_RADIUS}
            height={size - 2 * STEP_RADIUS}
          >
            <Circles />

            {dimensions.map(({ id }, index) => (
              <g
                key={id}
                className="origin-center"
                transform={`rotate(${getDimensionAngle(dimensions, index)})`}
              >
                <Dimension diagramWidth={size} />
              </g>
            ))}

            <g transform={`translate(${size / 2} ${size / 2})`}>
              <Slots>
                {(_, { x, y, step }) => (
                  <Step
                    key={step}
                    x={x}
                    y={y}
                    className="fill-slate-500 stroke-transparent"
                  />
                )}
              </Slots>

              {children}
            </g>
          </g>
        </svg>
      </div>
    </RadarContext.Provider>
  )
}

type DimensionProps = {
  diagramWidth: number
}

const Dimension = ({ diagramWidth }: DimensionProps) => {
  return (
    <>
      <line
        x1={diagramWidth / 2}
        y1={diagramWidth / 2}
        x2={diagramWidth}
        y2={diagramWidth / 2}
        className="stroke-slate-500"
      />
    </>
  )
}

const Circles = () => {
  const diagramWidth = useDiagramWidth()
  const range = useRange()
  const steps = getStepsFromRange(range)

  return (
    <>
      {steps.map((step) => (
        <circle
          key={step}
          className="fill-transparent stroke-slate-400"
          cx="50%"
          cy="50%"
          r={getLengthToSelection(diagramWidth, range, step)}
        />
      ))}
    </>
  )
}
