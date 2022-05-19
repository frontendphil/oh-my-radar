import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { finishMutations, uuid } from "../test-utils"
import { createChart, createDimension, renderChart } from "./test-utils"
import {
  Charts_Set_Input,
  DeleteDimensionDocument,
  Dimensions_Insert_Input,
  InsertDimensionDocument,
  UpdateChartDocument,
} from "./api"

describe("Admin", () => {
  const chartId = "chart-id"

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
      const updateMock = mutateChartMock(chartId, {
        title: "Changed title",
        min: chart.min,
        max: chart.max,
      })

      await renderChart({ chartId, mocks: [updateMock], chart })

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
            id: uuid(),
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

    describe("Adding a new dimension.", () => {
      it("immediately shows the new dimension but disables it.", async () => {
        const insertMock = insertDimensionMock({
          chartId,
          title: "New dimension",
        })

        await renderChart({ chartId, mocks: [insertMock] })

        await userEvent.type(
          screen.getByRole("textbox", { name: "Add dimension" }),
          "New dimension{enter}"
        )

        expect(
          screen.getByRole("listitem", { name: "New dimension" })
        ).toBeInTheDocument()
        expect(
          screen.getByRole("button", {
            name: `Remove dimension "New dimension"`,
          })
        ).toBeDisabled()
      })

      it("enables the dimension when it has been added.", async () => {
        const insertMock = insertDimensionMock({
          chartId,
          title: "New dimension",
        })

        await renderChart({ chartId, mocks: [insertMock] })

        await userEvent.type(
          screen.getByRole("textbox", { name: "Add dimension" }),
          "New dimension{enter}"
        )

        await finishMutations(insertMock)

        expect(
          screen.getByRole("listitem", { name: "New dimension" })
        ).toBeInTheDocument()
        expect(
          screen.getByRole("button", {
            name: `Remove dimension "New dimension"`,
          })
        ).toBeEnabled()
      })
    })

    it("should be possible to remove a dimension", async () => {
      const dimension = createDimension({ title: "Dimension" })

      const deleteMock = deleteDimensionMock(dimension.id)

      await renderChart({
        chart: {
          dimensions: [dimension],
        },
        mocks: [deleteMock],
      })

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

      const updateMock = mutateChartMock(chartId, {
        title: chart.title,
        min: chart.min,
        max: 10,
      })

      await renderChart({ chartId, chart, mocks: [updateMock] })

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

      const updateMock = mutateChartMock(chartId, {
        title: chart.title,
        max: chart.max,
        min: 0,
      })

      await renderChart({ chartId, chart, mocks: [updateMock] })

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

      const updateMock = mutateChartMock(chartId, {
        title: chart.title,
        min: chart.min,
        max: chart.max,
      })

      await renderChart({ chartId, chart, mocks: [updateMock] })

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

      const updateMock = mutateChartMock(chartId, {
        title: chart.title,
        max: chart.max,
        min: chart.min,
      })

      await renderChart({ chartId, chart, mocks: [updateMock] })

      await setMin(6)

      await finishMutations(updateMock)

      expect(
        screen.getByRole("spinbutton", { name: "Min value" })
      ).toHaveAccessibleDescription(`Min value must be less than ${chart.max}`)
    })
  })

  describe("Links", () => {
    describe("Participants", () => {
      it("shows a link to the view for participants.", async () => {
        await renderChart()

        expect(
          screen.getByRole("textbox", { name: "Participant view" })
        ).toHaveValue(`${window.location.origin}/participate/chart-id`)
      })

      it("shows disables the input for the participant view.", async () => {
        await renderChart()

        expect(
          screen.getByRole("textbox", { name: "Participant view" })
        ).toBeDisabled()
      })

      it("explains the participants view.", async () => {
        await renderChart()

        expect(
          screen.getByRole("textbox", { name: "Participant view" })
        ).toHaveAccessibleDescription(
          "Give this link to the people who should fill out this chart."
        )
      })
    })

    describe("Results", () => {
      it("shows a link to the results view.", async () => {
        await renderChart()

        expect(
          screen.getByRole("textbox", { name: "Results view" })
        ).toHaveValue(`${window.location.origin}/results/chart-id`)
      })

      it("shows disables the input for results view.", async () => {
        await renderChart()

        expect(
          screen.getByRole("textbox", { name: "Results view" })
        ).toBeDisabled()
      })

      it("explains the results view.", async () => {
        await renderChart()

        expect(
          screen.getByRole("textbox", { name: "Results view" })
        ).toHaveAccessibleDescription(
          "Use this link to see all answers that have been submitted. Everyone with this link can see the results."
        )
      })
    })
  })
})
