import { MockedResponse } from "@apollo/client/testing"
import { finishQueries, ItemType, render, uuid } from "../test-utils"
import { ParticipantGetChartDocument, ParticipantGetChartQuery } from "./api"
import { Participate } from "./Participate"

type Chart = Omit<
  NonNullable<ParticipantGetChartQuery["charts_by_pk"]>,
  "__typename"
>

export const createChart = (
  chart: Partial<Chart> = {}
): NonNullable<ParticipantGetChartQuery["charts_by_pk"]> => ({
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

  id: uuid(),
})

const getChartMock = (
  id: string,
  charts_by_pk: ParticipantGetChartQuery["charts_by_pk"]
) => ({
  request: {
    query: ParticipantGetChartDocument,
    variables: {
      id,
    },
  },
  result: {
    data: {
      charts_by_pk,
    },
  },
})

type RenderOptions = {
  chartId?: string
  mocks?: MockedResponse[]
  chart?: Partial<Chart>
}

export const renderChart = async ({
  chartId = "chart-id",
  mocks = [],
  chart = createChart(),
}: RenderOptions = {}): Promise<ReturnType<typeof render>> => {
  const chartMock = getChartMock(chartId, createChart(chart))

  const renderResult = render(<Participate />, {
    mocks: [chartMock, ...mocks],
    path: "/participate/:id",
    route: `/participate/${chartId}`,
  })

  await finishQueries(chartMock)

  return renderResult
}
