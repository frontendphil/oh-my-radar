import { Children, PropsWithChildren, useId, useRef } from "react"
import { TabsContextProvider, useRegisterTabPanel } from "./TabsContext"

type Props = PropsWithChildren<{
  activeTab: string | null
  onChange: (tabId: string) => void
}>

export const Tabs = ({ children, activeTab, onChange }: Props) => {
  const id = useId()

  return (
    <TabsContextProvider activeTab={activeTab} onChange={onChange}>
      {(tabs) => (
        <div className="flex h-full flex-col">
          <div id={id} className="flex" role="tablist">
            {Children.map(children, (child) => (
              <div className="flex-1">{child}</div>
            ))}
          </div>

          {tabs.map((tabId) => (
            <TabPanel key={tabId} tabId={tabId} active={activeTab === tabId} />
          ))}
        </div>
      )}
    </TabsContextProvider>
  )
}

type TabPanelProps = {
  tabId: string
  active: boolean
}

const TabPanel = ({ tabId, active }: TabPanelProps) => {
  const tabPanelId = useId()
  const tabPanel = useRef<HTMLDivElement | null>(null)

  useRegisterTabPanel(tabId, tabPanelId, tabPanel)

  return (
    <div
      id={tabPanelId}
      role="tabpanel"
      aria-expanded={active ? "true" : "false"}
      aria-labelledby={tabId}
      ref={tabPanel}
      className={`${active ? "block" : "hidden"} flex-1 overflow-y-auto`}
    />
  )
}
