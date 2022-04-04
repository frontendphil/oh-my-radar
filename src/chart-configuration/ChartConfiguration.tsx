import { useCallback, useState } from "react"
import { Input, NumberInput } from "../form-controls"
import { Dimension, Range, Participant } from "../radar-chart"

import { Dimensions } from "./Dimensions"
import { Participants } from "./Participants"

type Configuration = {
  title: string
  range: Range
  participants: Participant[]
  dimensions: Dimension[]
}

type Props = {
  activeParticipantId?: string
  configuration: Configuration
  onChange: (configuration: Configuration) => void
  onActivateParticipant?: (selectionId: string) => void
}

export const ChartConfiguration = ({
  configuration,
  activeParticipantId,
  onChange,
  onActivateParticipant,
}: Props) => {
  const { title, participants, dimensions, range } = configuration

  const [min, max] = range

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Title"
        value={title}
        onChange={(title) => onChange({ ...configuration, title })}
      />

      <Participants
        participants={participants}
        activeParticipantId={activeParticipantId}
        onAdd={(selectionDescriptor) =>
          onChange({
            ...configuration,
            participants: [...participants, selectionDescriptor],
          })
        }
        onChange={(updatedSelectionDescriptor) =>
          onChange({
            ...configuration,
            participants: participants.map((selectionDescriptor) => {
              if (selectionDescriptor.id === updatedSelectionDescriptor.id) {
                return updatedSelectionDescriptor
              }

              return selectionDescriptor
            }),
          })
        }
        onActivate={onActivateParticipant}
      />

      <Dimensions
        dimensions={dimensions}
        onAdd={(dimensionDescriptor) =>
          onChange({
            ...configuration,
            dimensions: [...configuration.dimensions, dimensionDescriptor],
          })
        }
        onRemove={(dimensionId) =>
          onChange({
            ...configuration,
            dimensions: dimensions.filter(({ id }) => id !== dimensionId),
          })
        }
      />

      <NumberInput
        label="Min value"
        value={min}
        onChange={(value) =>
          onChange({
            ...configuration,
            range: [Math.min(value, max - 1), max],
          })
        }
      />

      <NumberInput
        label="Max value"
        value={max}
        onChange={(value) =>
          onChange({
            ...configuration,
            range: [min, Math.max(value, min + 2)],
          })
        }
      />
    </div>
  )
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
