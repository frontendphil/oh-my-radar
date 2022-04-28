import { useCallback, useState } from "react"
import { Dimension, Participant, Range } from "../../radar-chart"

type Configuration = {
  title: string
  range: Range
  participants: Participant[]
  dimensions: Dimension[]
}

type UpdateFn = (configuration: Configuration) => Partial<Configuration>

export function useConfiguration(
  initialValue: Partial<Configuration> = {}
): [Configuration, (configuration: Partial<Configuration> | UpdateFn) => void] {
  const [configuration, setConfiguration] = useState<Configuration>({
    title: initialValue.title ?? "",
    range: initialValue.range ?? [0, 1],
    dimensions: initialValue.dimensions ?? [],
    participants: initialValue.participants ?? [],
  })

  const updateConfiguration = useCallback(
    (updatedConfiguration: Partial<Configuration> | UpdateFn) =>
      typeof updatedConfiguration === "function"
        ? setConfiguration((currentConfiguration) => ({
            ...currentConfiguration,
            ...updatedConfiguration(currentConfiguration),
          }))
        : setConfiguration((currentConfiguration) => ({
            ...currentConfiguration,
            ...updatedConfiguration,
          })),
    []
  )

  return [configuration, updateConfiguration]
}
