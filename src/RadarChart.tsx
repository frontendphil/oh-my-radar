import { ReactNode, useCallback, useState } from "react"

import { createRange, getDimensionAngle } from "./utils"
import { Range, Selection } from "./types"
import { RadarContext, UpdateOptions } from "./RadarContext"

type Props<Dimension extends string> = {
  title: string
  dimensions: Dimension[]
  range: Range
  width?: number
  height?: number
  children: ReactNode
}

type ChangeFn = (value: Selection) => void

type State = {
  [selection: string]: { value: Selection; onChange?: ChangeFn }
}

export function RadarChart<Dimension extends string>({
  title,
  dimensions,
  range,
  width = 500,
  height = 500,
  children,
}: Props<Dimension>) {
  const [selections, setSelections] = useState<State>({})
  const [activeSelection, setActiveSelection] = useState<string | null>(null)

  const updateSelection = useCallback(
    ({ name, value, onChange }: UpdateOptions) => {
      setSelections((currentSelections) => ({
        ...currentSelections,
        [name]: { value, onChange },
      }))
      setActiveSelection(name)
    },
    []
  )

  const steps = createRange(range)
  const stepSize = 50 / steps.length

  return (
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

      <RadarContext.Provider
        value={{ diagramWidth: width, dimensions, range, updateSelection }}
      >
        {children}
      </RadarContext.Provider>
      {/* {dimensions.length > 0 &&
        Object.keys(selectedValues).length === dimensions.length && (
          <g transform={`translate(${width / 2} ${height / 2})`}>
            <Plane
              diagramWidth={width}
              selection={selectedValues}
              dimensions={dimensions}
              range={range}
            />
          </g>
        )} */}

      {activeSelection && (
        <>
          {dimensions.map((dimension, index) => (
            <g
              key={dimension}
              className="origin-center"
              transform={`rotate(${getDimensionAngle(dimensions, index)})`}
            >
              <Dimension
                title={dimension}
                range={range}
                value={selections[activeSelection].value[dimension]}
                diagramWidth={width}
                onChange={(newValue) => {
                  const { value, onChange } = selections[activeSelection]

                  if (onChange) {
                    onChange({
                      ...value,
                      [dimension]: newValue,
                    })
                  }
                }}
              />
            </g>
          ))}
        </>
      )}
    </svg>
  )
}

type DimensionProps = {
  title: string
  range: Range
  value: number | undefined
  diagramWidth: number
  onChange: (value: number) => void
}

const Dimension = ({
  range,
  title,
  value,
  diagramWidth,
  onChange,
}: DimensionProps) => {
  const steps = createRange(range)
  const stepSize = 50 / steps.length

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

      {steps.map((step, index) => (
        <circle
          key={step}
          role="radio"
          aria-label={`${title} - ${step}`}
          aria-checked={value === step}
          cx={`${50 + (index + 1) * stepSize}%`}
          cy="50%"
          r={5}
          className={`${
            value === step ? "fill-pink-500" : "fill-slate-500"
          } cursor-pointer stroke-transparent hover:fill-pink-500`}
          onClick={() => onChange(step)}
        />
      ))}
    </>
  )
}
