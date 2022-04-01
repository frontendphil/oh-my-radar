import { useState } from "react"
import { Input } from "../form-controls"
import { NumberInput } from "../form-controls/NumberInput"
import { DimensionDescriptor, Range, Participant } from "../radar-chart"

import { Dimensions } from "./Dimensions"
import { Participants } from "./Participants"

type Configuration = {
  title: string
  range: Range
  participants: Participant[]
  dimensionDescriptors: DimensionDescriptor[]
}

type Props = {
  activeParticipantId: string
  configuration: Configuration
  onChange: (configuration: Configuration) => void
  onActivateParticipant: (selectionId: string) => void
}

export const ChartConfiguration = ({
  configuration,
  activeParticipantId,
  onChange,
  onActivateParticipant,
}: Props) => {
  const { title, participants, dimensionDescriptors, range } = configuration

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
        dimensionDescriptors={dimensionDescriptors}
        onAdd={(dimensionDescriptor) =>
          onChange({
            ...configuration,
            dimensionDescriptors: [
              ...configuration.dimensionDescriptors,
              dimensionDescriptor,
            ],
          })
        }
        onRemove={(dimensionId) =>
          onChange({
            ...configuration,
            dimensionDescriptors: dimensionDescriptors.filter(
              ({ id }) => id !== dimensionId
            ),
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
  initialValue: Configuration
): [Configuration, (configuration: Configuration) => void] {
  return useState<Configuration>(initialValue)
}
