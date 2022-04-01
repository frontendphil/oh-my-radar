import { Plane } from "../Plane"
import { Selection } from "../types"

type Props = {
  selections: Selection[]
}

export const SelectionAverage = ({ selections }: Props) => {
  const summedDimensions = selections.reduce(
    (result: Selection, selection: Selection) => {
      for (const [key, value] of Object.entries(selection)) {
        result[key] = (result[key] || 0) + value
      }

      return result
    },
    {}
  )

  const selection: Selection = {}

  for (const [dimension, value] of Object.entries(summedDimensions)) {
    selection[dimension] = value / selections.length
  }

  return (
    <Plane
      label="Average"
      selection={selection}
      stroke="stroke-gray-500"
      fill="fill-gray-100"
    />
  )
}
