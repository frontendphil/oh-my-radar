import invariant from "invariant"
import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react"

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

export const useRegisterTabPanel = (
  tabId: string,
  tabPanelId: string,
  tabPanel: RefObject<HTMLDivElement | null>
) => {
  const { registerPanel } = useContext(TabsContext)

  useEffect(() => {
    registerPanel(tabId, tabPanelId, tabPanel)
  }, [tabPanel, registerPanel, tabId, tabPanelId])
}

type TabsContextProviderProps = {
  activeTab: string | null
  children: (tabs: string[]) => ReactNode
  onChange: (tabId: string) => void
}

export const TabsContextProvider = ({
  children,
  activeTab,
  onChange,
}: TabsContextProviderProps) => {
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
      {children(tabs)}
    </TabsContext.Provider>
  )
}
