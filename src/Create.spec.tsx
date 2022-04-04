import { render as baseRender, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MockedProvider, MockedResponse } from "@apollo/client/testing"
import { Create } from "./Create"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { CreateChartDocument } from "./__generated__/api"
import { ReactNode } from "react"
import { finishMutations } from "./test-utils"

describe("Create", () => {
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
      mocks: [
        {
          request: {
            query: CreateChartDocument,
            variables: {
              chart: {
                title: "New chart",
                min: 1,
                max: 4,
              },
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
        },
      ],
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

    const chartMock = {
      request: {
        query: CreateChartDocument,
        variables: {
          chart: {
            title: "New chart",
            min: 1,
            max: 4,
          },
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

    render({
      mocks: [chartMock],
      routes: <Route path="/admin/:id" element={<Needle />} />,
    })

    await userEvent.click(
      screen.getByRole("button", { name: "Create new chart" })
    )

    await finishMutations()

    expect(screen.getByTestId("created")).toBeInTheDocument()
  })
})
