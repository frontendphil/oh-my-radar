import { ReactNode, useCallback, useEffect, useId, useState } from "react"
import { DimensionDescriptor, Range } from "./types"
import { RadarContext, useDiagramWidth, useRange } from "./RadarContext"
import { Slots } from "./Slots"
import { DimensionLabels } from "./DimensionLabels"
import { getLengthToSelection } from "./getLengthToSelection"
import { Step, STEP_RADIUS } from "./Step"
import { getStepsFromRange } from "./getStepsFromRange"
import { getDimensionAngle } from "./getDimensionAngle"
import { Dimension, DimensionMarker, DIMENSION_OVERLAP } from "./Dimension"

type Props = {
  title: string
  dimensions: DimensionDescriptor[]
  range: Range
  size?: number
  children?: ReactNode
}

export function RadarChart({
  title,
  dimensions,
  range,
  size: maxUserDefinedSize = 500,
  children,
}: Props) {
  const titleId = useId()
  const padding = STEP_RADIUS + DIMENSION_OVERLAP

  const size = useResponsiveSize(maxUserDefinedSize)

  const canvasSize = size - 2 * STEP_RADIUS - DIMENSION_OVERLAP

  return (
    <div>
      <h1
        id={titleId}
        className="mb-5 text-center text-2xl font-semibold md:mb-10"
      >
        {title}
      </h1>

      <RadarContext.Provider
        value={{ diagramWidth: canvasSize, dimensions, range }}
      >
        <div className="relative" style={{ width: size, height: size }}>
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
            aria-labelledby={titleId}
            width={size}
            height={size}
          >
            <defs>
              <DimensionMarker size={5} />
            </defs>

            <g x={padding} y={padding}>
              {dimensions.map(({ id }, index) => (
                <Dimension
                  key={id}
                  angle={getDimensionAngle(dimensions, index)}
                  diagramWidth={size}
                />
              ))}
            </g>

            <g
              x={padding}
              y={padding}
              width={size - 2 * STEP_RADIUS}
              height={size - 2 * STEP_RADIUS}
            >
              <Circles />

              <g transform={`translate(${size / 2} ${size / 2})`}>
                <Slots>
                  {(_, { x, y, step }) => (
                    <Step disabled key={step} x={x} y={y} />
                  )}
                </Slots>

                {children}
              </g>
            </g>
          </svg>
        </div>
      </RadarContext.Provider>
    </div>
  )
}

const Circles = () => {
  const diagramWidth = useDiagramWidth()
  const range = useRange()
  const steps = getStepsFromRange(range)

  return (
    <>
      {steps.reverse().map((step) => (
        <circle
          key={step}
          className="fill-transparent stroke-zinc-500 dark:stroke-zinc-100"
          cx="50%"
          cy="50%"
          r={getLengthToSelection(diagramWidth, range, step)}
        />
      ))}
    </>
  )
}

const useResponsiveSize = (maxUserDefinedSize: number) => {
  const maxSize = useCallback(() => {
    if (typeof window === "undefined") {
      return maxUserDefinedSize
    }

    return Math.min(maxUserDefinedSize, window.innerWidth - 100)
  }, [maxUserDefinedSize])
  const [size, setSize] = useState(maxSize())

  useEffect(() => {
    const callback = () => {
      if (size !== maxSize()) {
        setSize(maxSize())
      }
    }

    window.addEventListener("resize", callback)

    return () => window.removeEventListener("resize", callback)
  }, [maxSize, size])

  return size
}
