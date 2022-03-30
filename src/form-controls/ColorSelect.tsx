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
            <ListboxOption value={Colors.green}>
              <Color color={Colors.green} />
            </ListboxOption>
            <ListboxOption value={Colors.purple}>
              <Color color={Colors.purple} />
            </ListboxOption>
            <ListboxOption value={Colors.yellow}>
              <Color color={Colors.yellow} />
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
  [Colors.green]: "border border-emerald-700 bg-emerald-200",
  [Colors.purple]: "border border-purple-700 bg-purple-200",
  [Colors.yellow]: "border border-yellow-700 bg-yellow-200",
}

const Color = ({ color, ...rest }: ColorProps) => (
  <div {...rest} className={`h-4 w-4 rounded-full ${colors[color]}`}>
    <VisuallyHidden>{ColorNames[color]}</VisuallyHidden>
  </div>
)
