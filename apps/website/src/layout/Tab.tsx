import { PropsWithChildren, useId } from "react"

type Props = PropsWithChildren<{
  active: boolean
  controls: string
  onClick: () => void
}>

export const Tab = ({ children, active, controls, onClick }: Props) => {
  const id = useId()

  return (
    <button
      id={id}
      aria-selected={active ? "true" : "false"}
      aria-controls={controls}
      className={`transition-color w-full border-b px-2 py-4 text-center ${
        active
          ? "dark:border-yellow-500 dark:bg-gray-700"
          : "dark:border-gray-600 dark:bg-gray-800 dark:hover:border-yellow-700"
      }`}
      role="tab"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
