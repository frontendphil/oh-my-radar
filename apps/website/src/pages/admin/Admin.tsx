import { useParams } from "react-router-dom"
import invariant from "invariant"
import { RadarChart, Selection, SelectionState } from "@radar/chart"
import { useAdminGetChartQuery } from "./api"

import { useState } from "react"

import { Canvas, SidePanel, Tab, Tabs, View } from "../../layout"
import { Configuration } from "./Configuration"
import { ActiveSelection, Participants } from "./Participants"

export const Admin = () => {
  const { id } = useParams()

  invariant(id, "Cannot show a chart without an id.")

  const { loading, data } = useAdminGetChartQuery({ variables: { id } })

  const [tab, setTab] = useState<string | null>(null)
  const [activeSelection, setActiveSelection] =
    useState<ActiveSelection | null>(null)

  if (loading) {
    return null
  }

  invariant(data?.charts_by_pk, "Could not load chart.")

  const { title, dimensions, min, max, participants } = data.charts_by_pk

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
            <Configuration chart={data.charts_by_pk} />
          </Tab>
          <Tab label="Participants">
            <Participants
              participants={participants}
              onSelect={setActiveSelection}
            />
          </Tab>
        </Tabs>
      </SidePanel>
    </View>
  )
}
