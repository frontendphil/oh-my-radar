import { LoaderFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { client } from "../../client"
import {
  ResultGetChartDocument,
  ResultGetChartQuery,
  ResultGetChartQueryVariables,
} from "../../api/results"
import { Results } from "../../pages/results"

export const loader: LoaderFunction = async ({ params }) => {
  const result = await client
    .query<ResultGetChartQuery, ResultGetChartQueryVariables>(
      ResultGetChartDocument,
      { id: params.id }
    )
    .toPromise()

  return result.data
}

export default function ResultsView() {
  return <Results data={useLoaderData()} />
}
