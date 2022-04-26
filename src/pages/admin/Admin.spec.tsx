import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { v4 } from "uuid"
import { finishMutations, finishQueries, render } from "../test-utils"
import { Admin } from "./Admin"
import { createChart, createDimension } from "./test-utils"
import {
  AdminGetChartDocument,
  AdminGetChartQuery,
  Charts_Set_Input,
  DeleteDimensionDocument,
  Dimensions_Insert_Input,
  InsertDimensionDocument,
  UpdateChartDocument,
} from "./api"

describe("Admin", () => {
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

  describe("Dimensions", () => {
    const insertDimensionMock = (dimension: Dimensions_Insert_Input) => ({
      request: {
        query: InsertDimensionDocument,
        variables: {
          dimension,
        },
      },
      result: {
        data: {
          insert_dimensions_one: {
            id: v4(),
            ...dimension,
          },
        },
      },
    })

    const deleteDimensionMock = (id: string) => ({
      request: {
        query: DeleteDimensionDocument,
        variables: {
          id,
        },
      },
      result: {
        data: {
          delete_dimensions_by_pk: {
            id,
          },
        },
      },
    })

    it("is possible to add a dimension.", async () => {
      const chart = createChart()
      const chartMock = getChartMock("chart-id", chart)
      const insertMock = insertDimensionMock({
        chartId: "chart-id",
        title: "New dimension",
      })

      render(<Admin />, {
        mocks: [chartMock, insertMock],
        path: "/admin/:id",
        route: "/admin/chart-id",
      })

      await finishQueries(chartMock)

      await userEvent.type(
        screen.getByRole("textbox", { name: "Add dimension" }),
        "New dimension{enter}"
      )

      await finishMutations(insertMock)

      expect(
        screen.getByRole("listitem", { name: "New dimension" })
      ).toBeInTheDocument()
    })

    it("should be possible to remove a dimension", async () => {
      const dimension = createDimension({ title: "Dimension" })

      const chartMock = getChartMock(
        "chart-id",
        createChart({
          dimensions: [dimension],
        })
      )
      const deleteMock = deleteDimensionMock(dimension.id)

      render(<Admin />, {
        mocks: [chartMock, deleteMock],
        path: "/admin/:id",
        route: "/admin/chart-id",
      })

      await finishQueries(chartMock)

      await userEvent.click(
        screen.getByRole("button", { name: 'Remove dimension "Dimension"' })
      )

      await finishMutations(deleteMock)

      expect(
        screen.queryByRole("listitem", { name: "Dimension" })
      ).not.toBeInTheDocument()
    })
  })

  describe("Range", () => {
    const dimensions = [
      createDimension({ title: "One" }),
      createDimension({ title: "Two" }),
      createDimension({ title: "Three" }),
    ]

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
