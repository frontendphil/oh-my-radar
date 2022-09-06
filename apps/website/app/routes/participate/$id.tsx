import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node"
import { client } from "../../client"
import {
  InsertParticipantDocument,
  InsertParticipantMutation,
  InsertParticipantMutationVariables,
  InsertSelectionsDocument,
  InsertSelectionsMutation,
  InsertSelectionsMutationVariables,
  ParticipantGetChartDocument,
  ParticipantGetChartQuery,
  ParticipantGetChartQueryVariables,
} from "../../api/participate"
import { Participate } from "../../pages/participate"
import { useLoaderData } from "@remix-run/react"
import { Colors, SelectionState } from "@radar/chart"
import invariant from "invariant"
import { getText } from "../../utils"

export const loader: LoaderFunction = async ({ params }) => {
  const result = await client
    .query<ParticipantGetChartQuery, ParticipantGetChartQueryVariables>(
      ParticipantGetChartDocument,
      { id: params.id }
    )
    .toPromise()

  return result.data
}

export default function ParticipateView() {
  return <Participate chart={useLoaderData()} />
}

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData()

  const name = getText(body.get("name"))

  const insertParticipant = await client
    .mutation<InsertParticipantMutation, InsertParticipantMutationVariables>(
      InsertParticipantDocument,
      {
        participant: {
          chartId: params.id,
          name,
          color: Colors.blue,
        },
      }
    )
    .toPromise()

  invariant(
    insertParticipant.data?.insert_participants_one,
    "Could not insert participant"
  )

  const { id: participantId } = insertParticipant.data.insert_participants_one

  const selection: SelectionState = JSON.parse(getText(body.get("selection")))

  const selections = Object.entries(selection).map(([dimensionId, value]) => ({
    chartId: params.id,
    dimensionId,
    participantId,
    value,
  }))

  await client
    .mutation<InsertSelectionsMutation, InsertSelectionsMutationVariables>(
      InsertSelectionsDocument,
      {
        selections,
      }
    )
    .toPromise()

  return redirect(`/participate/thank-you`)
}
