import { useCallback, useState } from "react"
import { Dimension, Participant, Range } from "../../radar-chart"

type Configuration = {
  title: string
  range: Range
  participants: Participant[]
  dimensions: Dimension[]
}

export function useConfiguration(
  initialValue: Partial<Configuration> = {}
): [Configuration, (configuration: Partial<Configuration>) => void] {
  const [configuration, setConfiguration] = useState<Configuration>({
    title: initialValue.title ?? "",
    range: initialValue.range ?? [0, 1],
    dimensions: initialValue.dimensions ?? [],
    participants: initialValue.participants ?? [],
  })

  const updateConfiguration = useCallback(
    (updatedConfiguration: Partial<Configuration>) =>
      setConfiguration((currentConfiguration) => ({
        ...currentConfiguration,
        ...updatedConfiguration,
      })),
    []
  )

  return [configuration, updateConfiguration]
}
