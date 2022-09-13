import { PropsWithChildren } from "react"
import { createPortal } from "react-dom"
import { useRegisteredTab } from "./TabsContext"

type Props = PropsWithChildren<{
  label: string
}>

export const Tab = ({ children, label }: Props) => {
  const { id, isActive, tabPanel, tabPanelId, activate } = useRegisteredTab()

  return (
    <>
      <button
        id={id}
        aria-selected={isActive ? "true" : "false"}
        aria-controls={tabPanelId}
        className={`transition-color w-full border-b px-2 py-4 text-center ${
          isActive
            ? "border-purple-500 bg-purple-50 dark:border-yellow-500 dark:bg-gray-700"
            : "border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-yellow-700"
        }`}
        role="tab"
        onClick={activate}
      >
        {label}
      </button>

      {tabPanel && createPortal(children, tabPanel)}
    </>
  )
}
