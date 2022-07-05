import { LoaderFunction, ActionFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import invariant from "invariant"
import {
  AdminGetChartDocument,
  AdminGetChartQuery,
  AdminGetChartQueryVariables,
  DeleteDimensionDocument,
  DeleteDimensionMutation,
  DeleteDimensionMutationVariables,
  InsertDimensionDocument,
  InsertDimensionMutation,
  InsertDimensionMutationVariables,
  UpdateChartDocument,
  UpdateChartMutation,
  UpdateChartMutationVariables,
} from "../../api/admin"
import { client } from "../../client"
import { Admin } from "../../pages/admin/Admin"

export const loader: LoaderFunction = async ({ params }) => {
  const result = await client
    .query<AdminGetChartQuery, AdminGetChartQueryVariables>(
      AdminGetChartDocument,
      { id: params.id }
    )
    .toPromise()

  return result.data
}

export default function ChartAdmin() {
  return <Admin initialConfiguration={useLoaderData()} />
}

export const action: ActionFunction = async ({ request, params }) => {
  const body = await request.formData()

  const chartId = params.id

  invariant(chartId, "Chart id parameter missing.")

  switch (body.get("action")) {
    case "add-dimension": {
      const title = body.get("title")

      if (typeof title !== "string") {
        return json(
          { error: "Dimension title is not a string" },
          { status: 400 }
        )
      }

      await client
        .mutation<InsertDimensionMutation, InsertDimensionMutationVariables>(
          InsertDimensionDocument,
          { dimension: { chartId, title } }
        )
        .toPromise()

      return null
    }
    case "remove-dimension": {
      const id = body.get("dimensionId")

      if (typeof id !== "string") {
        return json({ error: "Dimension id missing" }, { status: 400 })
      }

      await client
        .mutation<DeleteDimensionMutation, DeleteDimensionMutationVariables>(
          DeleteDimensionDocument,
          { id }
        )
        .toPromise()

      return null
    }
    case "update-chart": {
      const title = getText(body.get("title"))
      const min = getNumber(body.get("min"))
      const max = getNumber(body.get("max"))

      await client
        .mutation<UpdateChartMutation, UpdateChartMutationVariables>(
          UpdateChartDocument,
          { pk: { id: chartId }, payload: { title, min, max } }
        )
        .toPromise()

      return null
    }
  }
}

const getText = (value: FormDataEntryValue | null): string => {
  invariant(typeof value === "string", "Value is not a string.")

  return value
}

const getNumber = (value: FormDataEntryValue | null): number => {
  invariant(typeof value === "string", "Can only parse strings to numbers.")

  const number = parseInt(value, 10)

  invariant(!isNaN(number), "Number is NaN")

  return number
}
