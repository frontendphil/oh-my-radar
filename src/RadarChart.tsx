import { ReactNode } from "react"

import { createRange, getDimensionAngle } from "./utils"
import { Range } from "./types"
import { RadarContext } from "./RadarContext"
import { Slots } from "./Slots"

type Props<Dimension extends string> = {
  title: string
  dimensions: Dimension[]
  range: Range
  width?: number
  height?: number
  children: ReactNode
}

export function RadarChart<Dimension extends string>({
  title,
  dimensions,
  range,
  width = 500,
  height = 500,
  children,
}: Props<Dimension>) {
  const steps = createRange(range)
  const stepSize = 50 / steps.length

  return (
    <RadarContext.Provider value={{ diagramWidth: width, dimensions, range }}>
      <svg role="figure" aria-label={title} width={width} height={height}>
        <g>
          {steps.map((step, index) => (
            <circle
              key={step}
              className="fill-transparent stroke-slate-400"
              cx="50%"
              cy="50%"
              r={`${stepSize * (index + 1)}%`}
            />
          ))}
        </g>

        {dimensions.map((dimension, index) => (
          <g
            key={dimension}
            className="origin-center"
            transform={`rotate(${getDimensionAngle(dimensions, index)})`}
          >
            <Dimension title={dimension} diagramWidth={width} />
          </g>
        ))}

        <g transform={`translate(${width / 2} ${height / 2})`}>
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
