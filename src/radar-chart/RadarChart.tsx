import { ReactNode } from "react"

import { createRange, getDimensionAngle } from "./utils"
import { Range } from "./types"
import { RadarContext } from "./RadarContext"
import { Slots } from "./Slots"
import { DimensionLabels } from "./DimensionLabels"

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
  const steps = createRange(range)

  return (
    <RadarContext.Provider value={{ diagramWidth: size, dimensions, range }}>
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
          <Circles steps={steps} />

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
                <circle
                  key={step}
                  cx={x}
                  cy={y}
                  r={5}
                  className="fill-slate-500 stroke-transparent"
                />
              )}
            </Slots>

            {children}
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

type CircleProps = {
  steps: number[]
}

const Circles = ({ steps }: CircleProps) => {
  const stepSize = 50 / steps.length

  return (
    <>
      {steps.map((step, index) => (
        <circle
          key={step}
          className="fill-transparent stroke-slate-400"
          cx="50%"
          cy="50%"
          r={`${stepSize * (index + 1)}%`}
        />
      ))}
    </>
  )
}
