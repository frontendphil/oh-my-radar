import { useSelection } from "./RadarContext"
import { Selection as SelectionValue } from "./types"

type Props = {
  name: string
  value: SelectionValue
  onChange?: (value: SelectionValue) => void
}

export function Selection({ name, value, onChange }: Props) {
  useSelection({ name, value, onChange })
  return null
}
