import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from "@reach/listbox"
import { VisuallyHidden } from "@reach/visually-hidden"
import { HTMLAttributes } from "react"
import { ColorNames, Colors } from "../configuration"
import { useId } from "./useId"

type Props = {
  label: string
  value: Colors
  onChange: (color: Colors) => void
}

export const ColorSelect = ({ label, value, onChange }: Props) => {
  const id = useId()
  return (
    <div>
      <VisuallyHidden id={id}>{label}</VisuallyHidden>
      <ListboxInput aria-labelledby={id} value={value} onChange={onChange}>
        <ListboxButton aria-label={label}>
          <Color color={value} />
        </ListboxButton>
        <ListboxPopover>
          <ListboxList>
            <ListboxOption value={Colors.pink}>
              <Color color={Colors.pink} />
            </ListboxOption>
            <ListboxOption value={Colors.blue}>
              <Color color={Colors.blue} />
            </ListboxOption>
          </ListboxList>
        </ListboxPopover>
      </ListboxInput>
    </div>
  )
}

type ColorProps = HTMLAttributes<HTMLDivElement> & {
  color: Colors
}

const colors = {
  [Colors.pink]: "border border-pink-700 bg-pink-200",
  [Colors.blue]: "border border-blue-700 bg-blue-200",
}

const Color = ({ color, ...rest }: ColorProps) => (
  <div {...rest} className={`h-4 w-4 rounded-full ${colors[color]}`}>
    <VisuallyHidden>{ColorNames[color]}</VisuallyHidden>
  </div>
)
