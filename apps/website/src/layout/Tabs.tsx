import invariant from "invariant"
import {
  Children,
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

type Props = PropsWithChildren<{
  activeTab: string | null
  onChange: (tabId: string) => void
}>

export const Tabs = ({ children, activeTab, onChange }: Props) => {
  const id = useId()

  const [tabs, setTabs] = useState<string[]>([])

  useEffect(() => {
    if (tabs.length === 0) {
      return
    }

    if (activeTab) {
      return
    }

    const [firstTab] = tabs

    onChange(firstTab)
  }, [activeTab, onChange, tabs])

  const [tabPanels, setTabPanels] = useState<
    Record<
      string,
      { tabPanelId: string; tabPanel: RefObject<HTMLDivElement | null> }
    >
  >({})

  const registerTab = useCallback((tabId: string) => {
    setTabs((currentTabs) => [...currentTabs, tabId])
  }, [])

  const deregisterTab = useCallback(
    (tabId: string) =>
      setTabs((currentTabs) => currentTabs.filter((id) => id !== tabId)),
    []
  )

  const registerPanel = useCallback(
    (
      tabId: string,
      tabPanelId: string,
      tabPanel: RefObject<HTMLDivElement | null>
    ) => {
      setTabPanels((currentTabPanels) => ({
        ...currentTabPanels,
        [tabId]: { tabPanel, tabPanelId },
      }))
    },
    []
  )

  const getPanel = useCallback(
    (tabId: string) => {
      if (!(tabId in tabPanels)) {
        return { tabPanel: null, tabPanelId: undefined }
      }

      const { tabPanel, tabPanelId } = tabPanels[tabId]

      invariant(tabPanel, `Could not find a panel for tab "${tabId}".`)

      return { tabPanel: tabPanel.current, tabPanelId }
    },
    [tabPanels]
  )

  return (
    <TabsContext.Provider
      value={{
        activeTabId: activeTab,
        registerTab,
        deregisterTab,
        registerPanel,
        getPanel,
        setActiveTab: onChange,
      }}
    >
      <div id={id} className="flex" role="tablist">
        {Children.map(children, (child) => (
          <div className="flex-1">{child}</div>
        ))}
      </div>

      {tabs.map((tabId) => (
        <TabPanel key={tabId} tabId={tabId} active={activeTab === tabId} />
      ))}
    </TabsContext.Provider>
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
      className={active ? "block" : "hidden"}
    />
  )
}

const TabsContext = createContext<{
  activeTabId: string | null
  registerTab: (tabId: string) => void
  deregisterTab: (tabId: string) => void
  registerPanel: (
    tabId: string,
    tabPanelId: string,
    tabPanel: RefObject<HTMLDivElement | null>
  ) => void
  getPanel: (tabId: string) => {
    tabPanelId: string | undefined
    tabPanel: HTMLDivElement | null
  }
  setActiveTab: (tabId: string) => void
}>({
  activeTabId: null,

  registerTab: (tabId: string) => {
    throw new Error(`Cannot register tab "${tabId}" outside TabsContext.`)
  },
  deregisterTab: (tabId: string) => {
    throw new Error(`Cannot deregister tab "${tabId}" outside TabsContext.`)
  },
  registerPanel: (tabId: string) => {
    throw new Error(
      `Cannot register tab panel  for tab "${tabId}" outside TabsContext.`
    )
  },
  getPanel: (tabId: string) => {
    throw new Error(`Cannot get panel for tab "${tabId}" outside TabsContext.`)
  },
  setActiveTab: (tabId: string) => {
    throw new Error(`Cannot activate tab "${tabId}" outside TabsContext.`)
  },
})

export const useRegisteredTab = () => {
  const id = useId()
  const { registerTab, deregisterTab, getPanel, activeTabId, setActiveTab } =
    useContext(TabsContext)

  useEffect(() => {
    registerTab(id)

    return () => deregisterTab(id)
  }, [registerTab, id, deregisterTab])

  return {
    id,
    isActive: activeTabId === id,
    ...getPanel(id),
    activate: () => setActiveTab(id),
  }
}

const useRegisterTabPanel = (
  tabId: string,
  tabPanelId: string,
  tabPanel: RefObject<HTMLDivElement | null>
) => {
  const { registerPanel } = useContext(TabsContext)

  useEffect(() => {
    registerPanel(tabId, tabPanelId, tabPanel)
  }, [tabPanel, registerPanel, tabId, tabPanelId])
}
