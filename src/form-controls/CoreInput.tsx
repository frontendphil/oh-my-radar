import { HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLInputElement> & {
  type?: string
  value?: string
}

export const CoreInput = (props: Props) => (
  <input
    type="text"
    {...props}
    className="rounded border-b border-slate-400 bg-white bg-opacity-10 px-2 py-2 text-white outline-none focus:border-yellow-400"
  />
)
