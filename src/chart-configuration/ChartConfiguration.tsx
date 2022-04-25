import { useCallback, useState } from "react"
import { Input, NumberInput } from "../form-controls"
import { Dimension, Range, Participant } from "../radar-chart"
import { NewDimension } from "../radar-chart/types"

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
  onAddDimension: (dimension: NewDimension) => void
  onRemoveDimension: (dimensionId: string) => void
  onSubmit: () => void
  onActivateParticipant?: (selectionId: string) => void
}

export const ChartConfiguration = ({
  configuration,
  activeParticipantId,
  onChange,
  onAddDimension,
  onRemoveDimension,
  onSubmit,
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
        onBlur={onSubmit}
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
        onAdd={onAddDimension}
        onRemove={onRemoveDimension}
      />

      <NumberInput
        label="Min value"
        value={min}
        isValid={(value) =>
          value < max ? [true] : [false, `Min value must be less than ${max}`]
        }
        onChange={(value) =>
          onChange({
            ...configuration,
            range: [value, max],
          })
        }
        onBlur={onSubmit}
      />

      <NumberInput
        label="Max value"
        value={max}
        isValid={(value) =>
          value > min
            ? [true]
            : [false, `Max value must be greater than ${min}`]
        }
        onChange={(value) =>
          onChange({
            ...configuration,
            range: [min, value],
          })
        }
        onBlur={onSubmit}
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
