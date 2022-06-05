import { PrimaryButton } from "../../form-controls"
import { View } from "../../layout"
import { StatsQuery } from "../../api/create"
import { Demo } from "./Demo"
import { useTransition } from "@remix-run/react"

type Props = {
  stats: StatsQuery
}

export const Create = ({ stats }: Props) => {
  const transition = useTransition()

  const creating = transition.state === "submitting"

  return (
    <View>
      <div className="grid h-screen w-full grid-rows-2 md:grid-cols-2 md:grid-rows-1 ">
        <div className="flex items-center justify-center p-12 md:p-24">
          <Demo />
        </div>

        <div className="flex h-full flex-col items-center justify-center gap-24">
          <PrimaryButton disabled={creating} type="submit">
            {creating ? "Creating your chart..." : "Create your own chart"}
          </PrimaryButton>

          <div className="text-xs uppercase">
            {`${stats?.participants_aggregate.aggregate?.count} people have participated in ${stats?.charts_aggregate.aggregate?.count} charts.`}
          </div>
        </div>
      </div>
    </View>
  )
}

export const defaultDimensions = (chartId: string) => [
  { title: "One", chartId },
  { title: "Two", chartId },
  { title: "Three", chartId },
]

export const defaultChart = () => ({ title: "New chart", min: 1, max: 4 })
