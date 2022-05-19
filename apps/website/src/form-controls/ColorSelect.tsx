import {
  ListboxButton,
  ListboxInput,
  ListboxList,
  ListboxOption,
  ListboxPopover,
} from "@reach/listbox"
import "@reach/listbox/styles.css"
import { VisuallyHidden } from "@reach/visually-hidden"
import { HTMLAttributes, useId } from "react"
import { Colors, getSelectionColor } from "@radar/chart"

const ColorNames = {
  [Colors.pink]: "Pink",
  [Colors.blue]: "Blue",
  [Colors.green]: "Green",
  [Colors.purple]: "Purple",
  [Colors.yellow]: "Yellow",
}

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
        <ListboxButton
          aria-label={label}
          className="flex border-0 p-0 outline-none"
        >
          <Color color={value} />
        </ListboxButton>
        <ListboxPopover className="border-1 mt-2 rounded border-gray-200 p-0 shadow-xl focus-within:border-blue-500 focus-within:outline-none focus-within:ring-blue-300">
          <ListboxList className="flex ">
            <ListboxOption
              value={Colors.pink}
              className="cursor-pointer rounded p-2 hover:bg-pink-50"
            >
              <Color color={Colors.pink} />
            </ListboxOption>
            <ListboxOption
              value={Colors.blue}
              className="cursor-pointer rounded p-2 hover:bg-blue-50"
            >
              <Color color={Colors.blue} />
            </ListboxOption>
            <ListboxOption
              value={Colors.green}
              className="cursor-pointer rounded p-2 hover:bg-emerald-50"
            >
              <Color color={Colors.green} />
            </ListboxOption>
            <ListboxOption
              value={Colors.purple}
              className="cursor-pointer rounded p-2 hover:bg-purple-50"
            >
              <Color color={Colors.purple} />
            </ListboxOption>
            <ListboxOption
              value={Colors.yellow}
              className="cursor-pointer rounded p-2 hover:bg-yellow-100"
            >
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

export const Color = ({ color, ...rest }: ColorProps) => {
  return (
    <div {...rest}>
      <VisuallyHidden>{ColorNames[color]}</VisuallyHidden>

      <svg width={16} height={16}>
        <circle
          cx="50%"
          cy="50%"
          r={6}
          className={`fill-transparent stroke-2 ${getSelectionColor(color)}`}
        />
      </svg>
    </div>
  )
}
