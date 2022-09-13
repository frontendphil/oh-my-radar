import { MockedResponse } from "@apollo/client/testing"
import { finishQueries, ItemType, render, uuid } from "../test-utils"
import { Admin } from "./Admin"
import { AdminGetChartDocument, AdminGetChartQuery } from "./api"

type Chart = NonNullable<AdminGetChartQuery["charts_by_pk"]>

export const createChart = (
  chart: Partial<Chart> = {}
): NonNullable<AdminGetChartQuery["charts_by_pk"]> => ({
  id: uuid(),
  title: "Test chart",
  min: 1,
  max: 4,
  dimensions: [],
  participants: [],
  ...chart,

  __typename: "charts",
})

type Dimension = ItemType<Chart["dimensions"]>

export const createDimension = (
  dimension: Partial<Dimension> = {}
): ItemType<Chart["dimensions"]> => ({
  title: "Test dimension",

  ...dimension,

  __typename: "dimensions",
  id: uuid(),
})

type Participant = ItemType<Chart["participants"]>

export const createParticipant = (
  participant: Partial<Participant> = {}
): ItemType<Chart["participants"]> => ({
  name: "Test participant",
  createdAt: new Date().toISOString(),

  ...participant,

  __typename: "participants",
  id: uuid(),
})

const getChartMock = (
  charts_by_pk: NonNullable<AdminGetChartQuery["charts_by_pk"]>
) => ({
  request: {
    query: AdminGetChartDocument,
    variables: { id: charts_by_pk.id },
  },
  result: {
    data: {
      charts_by_pk,
    },
  },
})

type RenderOptions = {
  chart?: Partial<Chart>
  mocks?: MockedResponse[]
}

export const renderChart = async ({
  mocks = [],
  chart,
}: RenderOptions = {}): Promise<ReturnType<typeof render>> => {
  const realChart = createChart(chart)
  const chartMock = getChartMock(realChart)

  const renderResult = render(<Admin />, {
    mocks: [chartMock, ...mocks],
    path: "/admin/:id",
    route: `/admin/${realChart.id}`,
  })

  await finishQueries(chartMock)

  return renderResult
}
