import { useId } from "react"
import { Label } from "../../form-controls"
import { InputLayout, List, ListItem } from "../../layout"
import { Colors } from "@radar/chart"
import { Color } from "./Color"

type AggregateState = {
  average: boolean
}

type AggregateProps = {
  aggregates: AggregateState
  onChange: (aggregates: AggregateState) => void
}

export const Aggregates = ({ aggregates, onChange }: AggregateProps) => {
  const id = useId()

  return (
    <InputLayout label={<Label htmlFor={id}>Aggregates</Label>}>
      <List id={id}>
        <ListItem>
          <Average
            checked={aggregates.average}
            onChange={(checked) =>
              onChange({ ...aggregates, average: checked })
            }
          />
        </ListItem>
      </List>
    </InputLayout>
  )
}

type AverageProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

const Average = ({ checked, onChange }: AverageProps) => {
  const id = useId()

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        className="mr-4"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <Color dashed color={Colors.green} />

      <label className="ml-2" htmlFor={id}>
        Average
      </label>
    </div>
  )
}
