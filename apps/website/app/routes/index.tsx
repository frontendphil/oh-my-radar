import { redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import {
  CreateChartDocument,
  CreateChartMutation,
  CreateChartMutationVariables,
  CreateDimensionsDocument,
  CreateDimensionsMutation,
  CreateDimensionsMutationVariables,
  StatsDocument,
  StatsQuery,
  StatsQueryVariables,
} from "../api/create"
import { client } from "../client"
import { Create, defaultDimensions, defaultChart } from "../pages/create"

export async function loader() {
  const result = await client
    .query<StatsQuery, StatsQueryVariables>(StatsDocument)
    .toPromise()

  return result.data
}

export async function action() {
  const chart = await client
    .mutation<CreateChartMutation, CreateChartMutationVariables>(
      CreateChartDocument,
      { chart: defaultChart() }
    )
    .toPromise()

  const { id } = chart.data.insert_charts_one

  await client
    .mutation<CreateDimensionsMutation, CreateDimensionsMutationVariables>(
      CreateDimensionsDocument,
      { dimensions: defaultDimensions(id) }
    )
    .toPromise()

  return redirect(`/admin/${id}`)
}

export default function CreateChart() {
  return <Create stats={useLoaderData()} />
}
