import { useParams } from "react-router-dom"
import invariant from "invariant"
import { RadarChart, Selection } from "@radar/chart"
import { useAdminGetChartQuery } from "./api"

import { useId, useState } from "react"

import { Canvas, SidePanel, Tab, Tabs, View } from "../../layout"
import { Configuration } from "./Configuration"

export const Admin = () => {
  const { id } = useParams()

  const configurationPanelId = useId()
  const participantsId = useId()

  invariant(id, "Cannot show a chart without an id.")

  const { loading, data } = useAdminGetChartQuery({ variables: { id } })

  const [tab] = useState("configuration")

  if (loading) {
    return null
  }

  invariant(data?.charts_by_pk, "Could not load chart.")

  const { title, dimensions, min, max } = data.charts_by_pk

  return (
    <View>
      <Canvas>
        <RadarChart title={title} dimensions={dimensions} range={[min, max]}>
          <Selection active name="example" />
        </RadarChart>
      </Canvas>
      <SidePanel>
        <Tabs>
          <Tab active={tab === "configuration"} controls={configurationPanelId}>
            Configuration
          </Tab>
          <Tab active={tab === "participants"} controls={participantsId}>
            Participants
          </Tab>
        </Tabs>

        {tab === "configuration" && (
          <div id={configurationPanelId} role="tabpanel" aria-expanded="true">
            <Configuration chart={data.charts_by_pk} />
          </div>
        )}
      </SidePanel>
    </View>
  )
}
