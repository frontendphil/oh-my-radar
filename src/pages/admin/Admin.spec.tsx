import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  createChart,
  createDimension,
  finishMutations,
  finishQueries,
  render,
} from "../test-utils"
import { Admin } from "./Admin"
import { GetChartDocument, UpdateChartDocument } from "./__generated__/api"

describe("Admin", () => {
  describe("Range", () => {
    const chart = createChart({ dimensions: [createDimension()] })

    const chartMock = {
      request: {
        query: GetChartDocument,
        variables: { id: "chart-id" },
      },
      result: {
        data: {
          charts_by_pk: {
            id: "chart-id",
            title: "Test chart",
            min: 1,
            max: 4,

            dimensions: [
              {
                id: "dimension-1",
                title: "Test",
              },
            ],
          },
        },
      },
    }

    const updateMock = {
      request: {
        query: UpdateChartDocument,
        variables: {
          pk: { id: "chart-id" },
          payload: { min: 10 },
        },
      },
      result: {},
    }

    const setMin = async (value: number) => {
      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Min value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Min value" }),
        value.toString()
      )
    }

    const setMax = async (value: number) => {
      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Max value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Max value" }),
        value.toString()
      )
    }

    it.only("is possible to change the upper bound of the selection range.", async () => {
      render(<Admin />, {
        mocks: [chartMock, updateMock],
        path: "/admin/:id",
        route: "/admin/chart-id",
      })

      await finishQueries(chartMock)

      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Max value" }),
        "10"
      )

      await finishMutations()

      expect(
        screen.getByRole("radio", { name: "Test - 10" })
      ).toBeInTheDocument()
    })

    it("is possible to change the lower bound of the selection range", async () => {
      render(<Admin />)

      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Min value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Min value" }),
        "0"
      )

      expect(
        screen.getByRole("radio", { name: "Test - 0" })
      ).toBeInTheDocument()
    })

    it("is not possible to enter an upper bound that is below the lower bound.", async () => {
      render(<Admin />)

      await setMin(4)
      await setMax(3)

      expect(screen.getByRole("spinbutton", { name: "Max value" })).toHaveValue(
        5
      )
    })

    it("is not possible to enter a lower bound that is greater than the upper bound.", async () => {
      render(<Admin />)

      await setMax(6)
      await setMin(8)

      expect(screen.getByRole("spinbutton", { name: "Min value" })).toHaveValue(
        5
      )
    })
  })
})
