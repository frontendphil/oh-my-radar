import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { defaultChart, defaultDimensions } from "./Create"
import { Route } from "react-router-dom"
import { CreateChartDocument, CreateDimensionsDocument } from "./api"

import { finishMutations } from "../test-utils"
import { render } from "./test-utils"

describe("Create", () => {
  const chartMock = {
    request: {
      query: CreateChartDocument,
      variables: {
        chart: defaultChart(),
      },
    },
    result: {
      data: {
        insert_charts_one: {
          id: "test-id",
          title: "New chart",
        },
      },
    },
  }

  const dimensionsMock = {
    request: {
      query: CreateDimensionsDocument,
      variables: {
        dimensions: defaultDimensions("test-id"),
      },
    },
    result: {
      data: {
        insert_dimensions: {
          returning: defaultDimensions("test-id").map((dimension, index) => ({
            ...dimension,
            id: `dimension-${index}`,
          })),
        },
      },
    },
  }

  it("renders a button to create a new chart.", async () => {
    await render()

    expect(
      screen.getByRole("button", { name: "Create your own chart" })
    ).toBeInTheDocument()
  })

  it("shows a loading state on the button while creating a new chart.", async () => {
    await render({
      mocks: [chartMock, dimensionsMock],
    })

    await userEvent.click(
      screen.getByRole("button", { name: "Create your own chart" })
    )

    expect(
      screen.getByRole("button", {
        name: "Creating your chart...",
      })
    ).toBeInTheDocument()
  })

  it("redirects to the chart admin when a chart has been created.", async () => {
    const Needle = () => <div data-testid="created" />

    await render({
      mocks: [chartMock, dimensionsMock],
      routes: <Route path="/admin/:id" element={<Needle />} />,
    })

    await userEvent.click(
      screen.getByRole("button", { name: "Create your own chart" })
    )

    await finishMutations(chartMock, dimensionsMock)

    expect(screen.getByTestId("created")).toBeInTheDocument()
  })

  it("shows how many charts have been created.", async () => {
    await render({
      chartStats: {
        aggregate: {
          count: 42,
        },
      },
      participantStats: {
        aggregate: {
          count: 12,
        },
      },
    })

    expect(screen.getByText("12 people have participated in 42 charts."))
  })
})
