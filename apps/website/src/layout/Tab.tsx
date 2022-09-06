import { PropsWithChildren, useId } from "react"

type Props = PropsWithChildren<{
  active: boolean
  controls: string
}>

export const Tab = ({ children, active, controls }: Props) => {
  const id = useId()

  return (
    <button
      id={id}
      aria-selected={active ? "true" : "false"}
      aria-controls={controls}
      className="w-full border-b border-gray-600 px-2 py-4 text-center"
      role="tab"
    >
      {children}
    </button>
  )
}
