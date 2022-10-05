import { RadarChart, Selection } from "@radar/chart"
import { useState } from "react"
import { Badge, Canvas, SidePanel, Tab, Tabs, View } from "../../layout"
import { Configuration } from "./Configuration"
import { ActiveSelection, Participants } from "./Participants"
import { useChartQuery } from "./useChart"

export const Admin = () => {
  const chart = useChartQuery()

  const [tab, setTab] = useState<string | null>(null)
  const [activeSelection, setActiveSelection] =
    useState<ActiveSelection | null>(null)

  if (!chart) {
    return null
  }

  const { title, dimensions, min, max, participants } = chart

  return (
    <View>
      <Canvas>
        <RadarChart title={title} dimensions={dimensions} range={[min, max]}>
          {activeSelection && (
            <Selection
              name={activeSelection.name}
              value={activeSelection.value}
            />
          )}
        </RadarChart>
      </Canvas>
      <SidePanel>
        <Tabs activeTab={tab} onChange={setTab}>
          <Tab label="Configuration">
            <Configuration />
          </Tab>
          <Tab
            label={
              <span className="flex items-center justify-center gap-2">
                Participants
                <Badge>{participants.length}</Badge>
              </span>
            }
          >
            <Participants onSelect={setActiveSelection} />
          </Tab>
        </Tabs>
      </SidePanel>
    </View>
  )
}
