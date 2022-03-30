import { ReactNode, useLayoutEffect, useRef, useState } from "react"

import { createRange, getDimensionAngle } from "./utils"
import { Range } from "./types"
import { RadarContext } from "./RadarContext"
import { Slots } from "./Slots"
import { getPoint } from "./getPoint"

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
        <DimensionLabels
          dimensions={dimensions}
          diagramWidth={size}
          range={range}
        />

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

type DimensionLabelsProps = {
  diagramWidth: number
  range: Range
  dimensions: string[]
}

const DimensionLabels = ({
  dimensions,
  diagramWidth,
  range,
}: DimensionLabelsProps) => {
  const [, max] = range

  return (
    <div
      style={{
        position: "absolute",
        left: diagramWidth / 2,
        top: diagramWidth / 2,
      }}
    >
      {dimensions.map((dimension, index) => {
        const { x, y } = getPoint({
          diagramWidth,
          range,
          value: max,
          angle: getDimensionAngle(dimensions, index),
        })

        return (
          <div
            key={dimension}
            style={{ position: "absolute", top: y, left: x }}
          >
            <Text align={getAlign(x)} justify={getJustify(y)}>
              {dimension}
            </Text>
          </div>
        )
      })}
    </div>
  )
}

const enum Align {
  left = "left",
  center = "center",
  right = "right",
}

const enum Justify {
  top = "top",
  center = "center",
  bottom = "bottom",
}

const getAlign = (x: number): Align => {
  if (x < 0) {
    return Align.right
  }

  if (x > 0) {
    return Align.left
  }

  return Align.center
}

const getJustify = (y: number): Justify => {
  if (y < 0) {
    return Justify.bottom
  }

  if (y > 0) {
    return Justify.top
  }

  return Justify.center
}

type TextProps = {
  children: string
  align: Align
  justify: Justify
}

const Text = ({ children, align, justify }: TextProps) => {
  const ref = useRef<HTMLSpanElement | null>(null)

  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)

  useLayoutEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const { width, height } = node.getBoundingClientRect()
    const padding = 10

    if (align === Align.left) {
      setLeft(padding)
    }

    if (align === Align.right) {
      setLeft(-(width + padding))
    }

    if (align === Align.center) {
      setLeft(-(width / 2))
    }

    if (justify === Justify.top) {
      setTop(padding)
    }

    if (justify === Justify.bottom) {
      setTop(-(height + padding))
    }

    if (justify === Justify.center) {
      setTop(-(height / 2))
    }
  }, [align, justify])

  return (
    <span className="relative" ref={ref} style={{ left, top }}>
      {children}
    </span>
  )
}
