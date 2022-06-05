import { MockedResponse } from "@apollo/client/testing"
import { finishQueries, render as baseRender } from "../test-utils"
import { Create } from "./Create"
import { StatsDocument, StatsQuery } from "../../api/create"

type ChartStats = Omit<
  NonNullable<StatsQuery["charts_aggregate"]>,
  "__typename"
>
type ParticipantStats = Omit<
  NonNullable<StatsQuery["participants_aggregate"]>,
  "__typename"
>

const getStatsMock = (
  chartStats: ChartStats,
  participantStats: ParticipantStats
): MockedResponse => ({
  request: {
    query: StatsDocument,
  },
  result: {
    data: {
      charts_aggregate: chartStats,
      participants_aggregate: participantStats,
    },
  },
})

type RenderOptions = Parameters<typeof baseRender>[1] & {
  chartStats?: ChartStats
  participantStats?: ParticipantStats
}

export const render = async ({
  chartStats = { aggregate: { count: 1 } },
  participantStats = { aggregate: { count: 1 } },
  mocks = [],
  ...rest
}: RenderOptions = {}) => {
  const statsMock = getStatsMock(chartStats, participantStats)

  const renderResult = baseRender(<Create />, {
    mocks: [statsMock, ...mocks],
    ...rest,
  })

  await finishQueries(statsMock)

  return renderResult
}
