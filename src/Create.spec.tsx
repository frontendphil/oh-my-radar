import { render as baseRender, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MockedProvider, MockedResponse } from "@apollo/client/testing"
import { Create, defaultChart, defaultDimensions } from "./Create"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import {
  CreateChartDocument,
  CreateDimensionsDocument,
} from "./__generated__/api"
import { ReactNode } from "react"
import { finishMutations } from "./test-utils"

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

  const render = ({
    mocks,
    routes,
  }: { mocks?: MockedResponse[]; routes?: ReactNode } = {}) => {
    baseRender(
      <MemoryRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Routes>
            <Route path="/" element={<Create />} />
            {routes}
          </Routes>
        </MockedProvider>
      </MemoryRouter>
    )
  }

  it("renders a button to create a new chart.", () => {
    render()

    expect(
      screen.getByRole("button", { name: "Create new chart" })
    ).toBeInTheDocument()
  })

  it("shows a loading state on the button while creating a new chart.", async () => {
    render({
      mocks: [chartMock, dimensionsMock],
    })

    await userEvent.click(
      screen.getByRole("button", { name: "Create new chart" })
    )

    expect(
      screen.getByRole("button", {
        name: "Creating your chart...",
      })
    ).toBeInTheDocument()
  })

  it("redirects to the chart admin when a chart has been created.", async () => {
    const Needle = () => <div data-testid="created" />

    render({
      mocks: [chartMock, dimensionsMock],
      routes: <Route path="/admin/:id" element={<Needle />} />,
    })

    await userEvent.click(
      screen.getByRole("button", { name: "Create new chart" })
    )

    await finishMutations(chartMock, dimensionsMock)

    expect(screen.getByTestId("created")).toBeInTheDocument()
  })
})
