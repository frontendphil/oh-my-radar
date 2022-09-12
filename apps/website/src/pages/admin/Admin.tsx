import { useParams } from "react-router-dom"
import invariant from "invariant"
import { RadarChart, Selection } from "@radar/chart"
import { useAdminGetChartQuery } from "./api"

import { useState } from "react"

import { Canvas, SidePanel, Tab, Tabs, View } from "../../layout"
import { Configuration } from "./Configuration"
import { Participants } from "./Participants"

export const Admin = () => {
  const { id } = useParams()

  invariant(id, "Cannot show a chart without an id.")

  const { loading, data } = useAdminGetChartQuery({ variables: { id } })

  const [tab, setTab] = useState<string | null>(null)

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
        <Tabs activeTab={tab} onChange={setTab}>
          <Tab label="Configuration">
            <div className="py-6 px-6 md:py-12">
              <Configuration chart={data.charts_by_pk} />
            </div>
          </Tab>
          <Tab label="Participants">
            <div className="py-6 px-6 md:py-12">
              <Participants />
            </div>
          </Tab>
        </Tabs>
      </SidePanel>
    </View>
  )
}
