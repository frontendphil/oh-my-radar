import { MockedResponse } from "@apollo/client/testing"
import { v4 } from "uuid"
import { finishQueries, ItemType, render } from "../test-utils"
import { Admin } from "./Admin"
import { AdminGetChartDocument, AdminGetChartQuery } from "./api"

type Chart = Omit<NonNullable<AdminGetChartQuery["charts_by_pk"]>, "__typename">

export const createChart = (
  chart: Partial<Chart> = {}
): NonNullable<AdminGetChartQuery["charts_by_pk"]> => ({
  title: "Test chart",
  min: 1,
  max: 4,
  dimensions: [],
  ...chart,
})

type Dimension = Omit<ItemType<Chart["dimensions"]>, "__typename">

export const createDimension = (
  dimension: Partial<Dimension> = {}
): ItemType<Chart["dimensions"]> => ({
  title: "Test dimension",

  ...dimension,

  id: v4(),
})

const getChartMock = (
  id: string,
  charts_by_pk: AdminGetChartQuery["charts_by_pk"]
) => ({
  request: {
    query: AdminGetChartDocument,
    variables: { id },
  },
  result: {
    data: {
      charts_by_pk,
    },
  },
})

type RenderOptions = {
  mocks?: MockedResponse[]
}

export const renderChart = async (
  chartId: string,
  chart: Partial<Chart>,
  { mocks = [] }: RenderOptions
): Promise<ReturnType<typeof render>> => {
  const chartMock = getChartMock(chartId, createChart(chart))

  const renderResult = render(<Admin />, {
    mocks: [chartMock, ...mocks],
    path: "/admin/:id",
    route: `/admin/${chartId}`,
  })

  await finishQueries(chartMock)

  return renderResult
}
