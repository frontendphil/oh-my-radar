import { ComponentType, HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLButtonElement> & {
  icon: ComponentType<HTMLAttributes<SVGElement>>
}

export const IconButton = ({ icon: Icon, ...rest }: Props) => (
  <button
    {...rest}
    className="rounded-full p-2 text-xs font-bold uppercase transition-all hover:bg-yellow-500 hover:text-yellow-900"
  >
    <Icon className="h-4 w-4" />
  </button>
)
