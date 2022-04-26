import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { finishMutations, finishQueries, render } from "../test-utils"
import { Admin } from "./Admin"
import { createChart, createDimension } from "./test-utils"
import {
  AdminGetChartDocument,
  AdminGetChartQuery,
  Charts_Set_Input,
  UpdateChartDocument,
} from "./__generated__/api"

describe("Admin", () => {
  const dimensions = [
    createDimension({ title: "One" }),
    createDimension({ title: "Two" }),
    createDimension({ title: "Three" }),
  ]

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

  const mutateChartMock = (id: string, payload: Charts_Set_Input) => ({
    request: {
      query: UpdateChartDocument,
      variables: {
        pk: { id },
        payload,
      },
    },
    result: {
      data: {
        update_charts_by_pk: { id, ...payload },
      },
    },
  })

  describe("Title", () => {
    it("is possible to change the title of the cart.", async () => {
      const chart = createChart({ title: "Initial title" })
      const chartMock = getChartMock("chart-id", chart)
      const updateMock = mutateChartMock("chart-id", {
        title: "Changed title",
        min: chart.min,
        max: chart.max,
      })

      render(<Admin />, {
        mocks: [chartMock, updateMock],
        path: "/admin/:id",
        route: "/admin/chart-id",
      })

      await finishQueries(chartMock)

      await userEvent.clear(screen.getByRole("textbox", { name: "Title" }))

      await userEvent.type(
        screen.getByRole("textbox", { name: "Title" }),
        "Changed title",
        {}
      )

      await userEvent.tab()

      await finishMutations(updateMock)

      expect(
        screen.getByRole("figure", { name: "Changed title" })
      ).toBeInTheDocument()
    })
  })

  describe("Range", () => {
    const setMin = async (value: number) => {
      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Min value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Min value" }),
        value.toString()
      )
      await userEvent.tab()
    }

    const setMax = async (value: number) => {
      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Max value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Max value" }),
        value.toString()
      )
      await userEvent.tab()
    }

    it("is possible to change the upper bound of the selection range.", async () => {
      const chart = createChart({ dimensions })

      const chartMock = getChartMock("chart-id", chart)
      const updateMock = mutateChartMock("chart-id", {
        title: chart.title,
        min: chart.min,
        max: 10,
      })

      render(<Admin />, {
        mocks: [chartMock, updateMock],
        path: "/admin/:id",
        route: "/admin/chart-id",
      })

      await finishQueries(chartMock)

      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Max value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Max value" }),
        "10"
      )
      await userEvent.tab()

      await finishMutations(updateMock)

      expect(
        screen.getByRole("radio", { name: "One - 10" })
      ).toBeInTheDocument()
    })

    it("is possible to change the lower bound of the selection range", async () => {
      const chart = createChart({ dimensions })

      const chartMock = getChartMock("chart-id", chart)
      const updateMock = mutateChartMock("chart-id", {
        title: chart.title,
        max: chart.max,
        min: 0,
      })

      render(<Admin />, {
        mocks: [chartMock, updateMock],
        path: "/admin/:id",
        route: "/admin/chart-id",
      })

      await finishQueries(chartMock)

      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Min value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Min value" }),
        "0"
      )
      await userEvent.tab()

      await finishMutations(updateMock)

      expect(screen.getByRole("radio", { name: "One - 0" })).toBeInTheDocument()
    })

    it("is not possible to enter an upper bound that is below the lower bound.", async () => {
      const chart = createChart({ min: 4, max: 4 })
      const chartMock = getChartMock("chart-id", chart)
      const updateMock = mutateChartMock("chart-id", {
        title: chart.title,
        min: chart.min,
        max: chart.max,
      })

      render(<Admin />, {
        mocks: [chartMock, updateMock],
        path: "/admin/:id",
        route: "/admin/chart-id",
      })

      await finishQueries(chartMock)

      await setMax(3)

      await finishMutations(updateMock)

      expect(
        screen.getByRole("spinbutton", { name: "Max value" })
      ).toHaveAccessibleDescription(
        `Max value must be greater than ${chart.min}`
      )
    })

    it("is not possible to enter a lower bound that is greater than the upper bound.", async () => {
      const chart = createChart({ min: 3, max: 5 })
      const chartMock = getChartMock("chart-id", chart)
      const updateMock = mutateChartMock("chart-id", {
        title: chart.title,
        max: chart.max,
        min: chart.min,
      })

      render(<Admin />, {
        mocks: [chartMock, updateMock],
        path: "/admin/:id",
        route: "/admin/chart-id",
      })

      await finishQueries(chartMock)

      await setMin(6)

      await finishMutations(updateMock)

      expect(
        screen.getByRole("spinbutton", { name: "Min value" })
      ).toHaveAccessibleDescription(`Min value must be less than ${chart.max}`)
    })
  })
})
