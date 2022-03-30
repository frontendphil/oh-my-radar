import { ReactNode } from "react"

import { createRange, getDimensionAngle } from "./utils"
import { Range } from "./types"
import { RadarContext, useDiagramWidth, useRange } from "./RadarContext"
import { Slots } from "./Slots"
import { DimensionLabels } from "./DimensionLabels"
import { getLengthToSelection } from "./getLengthToSelection"
import { Step } from "./Step"

type Props<Dimension extends string> = {
  title: string
  dimensions: Dimension[]
  range: Range
  size?: number
  children: ReactNode
}

export function RadarChart<Dimension extends string>({
  title,
  dimensions,
  range,
  size = 500,
  children,
}: Props<Dimension>) {
  return (
    <RadarContext.Provider
      value={{ diagramWidth: size - 10, dimensions, range }}
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
          <g x={5} y={5} width={size - 10} height={size - 10}>
            <Circles />

            {dimensions.map((dimension, index) => (
              <g
                key={dimension}
                className="origin-center"
                transform={`rotate(${getDimensionAngle(dimensions, index)})`}
              >
                <Dimension title={dimension} diagramWidth={size} />
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
  title: string
  diagramWidth: number
}

const Dimension = ({ title, diagramWidth }: DimensionProps) => {
  return (
    <>
      <line
        role="radiogroup"
        aria-label={title}
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
  const steps = createRange(range)

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
