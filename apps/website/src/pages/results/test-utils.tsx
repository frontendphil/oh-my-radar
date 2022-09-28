import { MockedResponse } from "@apollo/client/testing"
import { Colors } from "@radar/chart"
import { finishQueries, ItemType, render, uuid } from "../test-utils"
import { ResultGetChartDocument, ResultGetChartQuery } from "./api"
import { Results } from "./Results"

type Chart = Omit<
  NonNullable<ResultGetChartQuery["charts_by_pk"]>,
  "__typename"
>

export const createChart = (
  chart: Partial<Chart> = {}
): NonNullable<ResultGetChartQuery["charts_by_pk"]> => ({
  title: "Test chart",
  min: 1,
  max: 4,
  dimensions: [],
  participants: [],
  ...chart,
})

type Dimension = Omit<ItemType<Chart["dimensions"]>, "__typename">

export const createDimension = (
  dimension: Partial<Dimension> = {}
): ItemType<Chart["dimensions"]> => ({
  id: uuid(),
  title: "Test dimension",
  selections_aggregate: {},

  ...dimension,
})

type SelectionAggregate = Pick<Dimension, "selections_aggregate">

export const createAggregates = (value: number): SelectionAggregate => ({
  selections_aggregate: {
    aggregate: {
      avg: { value },
      min: { value },
      max: { value },
    },
  },
})

type Participant = Omit<ItemType<Chart["participants"]>, "__typename">

export const createParticipant = (
  participant: Partial<Participant> = {}
): ItemType<Chart["participants"]> => ({
  name: "John Doe",
  color: Colors.blue,

  selections: [],

  ...participant,

  id: uuid(),
})

type Selection = Omit<ItemType<Participant["selections"]>, "__typename">

export const createSelection = (
  selection: Partial<Selection>
): ItemType<Participant["selections"]> => ({
  dimensionId: uuid(),
  value: -1,

  ...selection,
})

const getChartMock = (
  id: string,
  charts_by_pk: ResultGetChartQuery["charts_by_pk"]
) => ({
  request: {
    query: ResultGetChartDocument,
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
  chart,
  mocks = [],
}: RenderOptions): Promise<ReturnType<typeof render>> => {
  const chartMock = getChartMock(chartId, createChart(chart))

  const renderResult = render(<Results />, {
    mocks: [chartMock, ...mocks],
    path: "/results/:id",
    route: `/results/${chartId}`,
  })

  await finishQueries(chartMock)

  return renderResult
}
