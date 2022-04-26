import { screen } from "@testing-library/react"
import { finishQueries, render } from "../test-utils"
import { Results } from "./Results"
import {
  createChart,
  createDimension,
  createParticipant,
  createSelection,
} from "./test-utils"
import {
  ResultGetChartDocument,
  ResultGetChartQuery,
} from "./__generated__/api"

describe("Results", () => {
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

  it("renders a figure when all options of a selection have been set.", async () => {
    const dimensionOne = createDimension({ title: "One" })
    const dimensionTwo = createDimension({ title: "Two" })
    const dimensionThree = createDimension({ title: "Three" })

    const participant = createParticipant({
      selections: [
        createSelection({ dimensionId: dimensionOne.id, value: 1 }),
        createSelection({ dimensionId: dimensionTwo.id, value: 1 }),
        createSelection({ dimensionId: dimensionThree.id, value: 1 }),
      ],
    })

    const chart = createChart({
      dimensions: [dimensionOne, dimensionTwo, dimensionThree],
      participants: [participant],
    })

    const chartMock = getChartMock("chart-id", chart)

    render(<Results />, {
      mocks: [chartMock],
      path: "/results/:id",
      route: "/results/chart-id",
    })

    await finishQueries(chartMock)

    expect(screen.getByRole("figure", { name: "John Doe" })).toBeInTheDocument()
  })
})
