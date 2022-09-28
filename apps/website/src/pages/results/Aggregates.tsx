import { PropsWithChildren, useId } from "react"
import { Label } from "../../form-controls"
import { InputLayout, List, ListItem } from "../../layout"
import { Colors } from "@radar/chart"
import { Color } from "./Color"

type AggregateState = {
  average: boolean
  min: boolean
  max: boolean
}

type AggregatesProps = {
  aggregates: AggregateState
  onChange: (aggregates: AggregateState) => void
}

export const Aggregates = ({ aggregates, onChange }: AggregatesProps) => {
  const id = useId()

  return (
    <InputLayout label={<Label htmlFor={id}>Aggregates</Label>}>
      <List id={id}>
        <ListItem>
          <Aggregate
            color={Colors.green}
            checked={aggregates.average}
            onChange={(checked) =>
              onChange({ ...aggregates, average: checked })
            }
          >
            Average
          </Aggregate>
        </ListItem>

        <ListItem>
          <Aggregate
            color={Colors.blue}
            checked={aggregates.min}
            onChange={(checked) => onChange({ ...aggregates, min: checked })}
          >
            Min
          </Aggregate>
        </ListItem>

        <ListItem>
          <Aggregate
            color={Colors.yellow}
            checked={aggregates.max}
            onChange={(checked) => onChange({ ...aggregates, max: checked })}
          >
            Max
          </Aggregate>
        </ListItem>
      </List>
    </InputLayout>
  )
}

type AggregateProps = PropsWithChildren<{
  color: Colors
  checked: boolean
  onChange: (checked: boolean) => void
}>

const Aggregate = ({ children, color, checked, onChange }: AggregateProps) => {
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

      <Color dashed color={color} />

      <label className="ml-2" htmlFor={id}>
        {children}
      </label>
    </div>
  )
}
