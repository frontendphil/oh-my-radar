import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { finishMutations, uuid } from "../test-utils"
import {
  Chart,
  createChart,
  createDimension,
  createParticipant,
  renderChart,
} from "./test-utils"
import {
  Charts_Set_Input,
  DeleteChartDocument,
  DeleteDimensionDocument,
  DeleteParticipantDocument,
  Dimensions_Insert_Input,
  Dimensions_Set_Input,
  InsertDimensionDocument,
  UpdateChartDocument,
  UpdateDimensionDocument,
} from "./api"
import { Route } from "react-router-dom"

describe("Admin", () => {
  const chartId = "chart-id"

  const mutateChartMock = (chart: Chart, payload: Charts_Set_Input) => ({
    request: {
      query: UpdateChartDocument,
      variables: {
        pk: { id: chart.id },
        payload,
      },
    },
    result: {
      data: {
        update_charts_by_pk: { ...chart, ...payload },
      },
    },
  })

  describe("Configuration", () => {
    describe("Title", () => {
      it("is possible to change the title of the cart.", async () => {
        const chart = createChart({ id: chartId, title: "Initial title" })
        const updateMock = mutateChartMock(chart, {
          title: "Changed title",
        })

        await renderChart({ mocks: [updateMock], chart })

        await userEvent.clear(screen.getByRole("textbox", { name: "Title" }))

        await userEvent.type(
          screen.getByRole("textbox", { name: "Title" }),
          "Changed title"
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
              __typename: "dimensions",
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
              __typename: "dimensions",
              id,
            },
          },
        },
      })

      const renameDimensionMock = (
        id: string,
        payload: Dimensions_Set_Input
      ) => ({
        request: {
          query: UpdateDimensionDocument,
          variables: {
            pk: { id },
            payload,
          },
        },
        result: {
          data: {
            update_dimensions_by_pk: {
              __typename: "dimensions",
              id,
              ...payload,
            },
          },
        },
      })

      it("is possible to add a new dimension.", async () => {
        const insertMock = insertDimensionMock({
          chartId,
          title: "New dimension",
        })

        await renderChart({ mocks: [insertMock], chart: { id: chartId } })

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

      it("is possible to rename a dimension.", async () => {
        const dimension = createDimension({ title: "Initial title" })

        const chart = createChart({ dimensions: [dimension] })

        const updateMock = renameDimensionMock(dimension.id, {
          chartId: chart.id,
          id: dimension.id,
          title: "Changed title",
        })

        await renderChart({
          chart,
          mocks: [updateMock],
        })

        const { getByRole } = within(
          screen.getByRole("list", { name: "Dimensions" })
        )

        await userEvent.click(getByRole("button", { name: "Edit" }))
        await userEvent.clear(getByRole("textbox", { name: "Dimension label" }))
        await userEvent.type(
          getByRole("textbox", { name: "Dimension label" }),
          "Changed title"
        )
        await userEvent.click(getByRole("button", { name: "Accept" }))

        await finishMutations(updateMock)

        expect(
          screen.getByRole("figure", { name: "Changed title" })
        ).toBeInTheDocument()
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
        const chart = createChart({ id: chartId, dimensions })

        const updateMock = mutateChartMock(chart, {
          max: 10,
        })

        await renderChart({ chart, mocks: [updateMock] })

        await userEvent.clear(
          screen.getByRole("spinbutton", { name: "Max value" })
        )
        await userEvent.type(
          screen.getByRole("spinbutton", { name: "Max value" }),
          "10"
        )
        await userEvent.tab()

        await finishMutations(updateMock)

        const { getByRole } = within(
          screen.getByRole("figure", { name: "One" })
        )

        expect(getByRole("radio", { name: "10" })).toBeInTheDocument()
      })

      it("is possible to change the lower bound of the selection range", async () => {
        const chart = createChart({ id: chartId, dimensions })

        const updateMock = mutateChartMock(chart, {
          min: 0,
        })

        await renderChart({ chart, mocks: [updateMock] })

        await userEvent.clear(
          screen.getByRole("spinbutton", { name: "Min value" })
        )
        await userEvent.type(
          screen.getByRole("spinbutton", { name: "Min value" }),
          "0"
        )
        await userEvent.tab()

        await finishMutations(updateMock)

        const { getByRole } = within(
          screen.getByRole("figure", { name: "One" })
        )

        expect(getByRole("radio", { name: "0" })).toBeInTheDocument()
      })

      it("is not possible to enter an upper bound that is below the lower bound.", async () => {
        const chart = createChart({ id: chartId, min: 4, max: 4 })

        const updateMock = mutateChartMock(chart, {
          max: 3,
        })

        await renderChart({ chart, mocks: [updateMock] })

        await setMax(3)

        await finishMutations(updateMock)

        expect(
          screen.getByRole("spinbutton", { name: "Max value" })
        ).toHaveAccessibleDescription(
          `Max value must be greater than ${chart.min}`
        )
      })

      it("is not possible to enter a lower bound that is greater than the upper bound.", async () => {
        const chart = createChart({ id: chartId, min: 3, max: 5 })

        const updateMock = mutateChartMock(chart, {
          min: 6,
        })

        await renderChart({ chart, mocks: [updateMock] })

        await setMin(6)

        await finishMutations(updateMock)

        expect(
          screen.getByRole("spinbutton", { name: "Min value" })
        ).toHaveAccessibleDescription(
          `Min value must be less than ${chart.max}`
        )
      })
    })

    describe("Links", () => {
      describe("Participants", () => {
        it("shows a link to the view for participants.", async () => {
          await renderChart({ chart: { id: "chart-id" } })

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
          await renderChart({ chart: { id: "chart-id" } })

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

    describe("Danger zone", () => {
      const removeChartMock = (id: string) => ({
        request: {
          query: DeleteChartDocument,
          variables: {
            id,
          },
        },
        result: {
          data: {
            delete_charts_by_pk: { __typename: "charts", id },
          },
        },
      })
      it("is possible to remove a chart.", async () => {
        const chart = createChart()
        const removeChart = removeChartMock(chart.id)

        const Needle = () => <div data-testid="deleted" />
        await renderChart({
          chart,
          mocks: [removeChart],
          routes: <Route path="/" element={<Needle />} />,
        })

        await userEvent.click(
          screen.getByRole("button", { name: "Delete chart" })
        )

        await finishMutations(removeChart)

        expect(screen.getByTestId("deleted")).toBeInTheDocument()
      })
    })
  })

  describe("Participants", () => {
    const deleteParticipantMock = (id: string) => ({
      request: {
        query: DeleteParticipantDocument,
        variables: {
          id,
        },
      },
      result: {
        data: {
          delete_participants_by_pk: { id, __typename: "participants" },
        },
      },
    })

    it("shows when no one has participated, yet.", async () => {
      await renderChart()

      await userEvent.click(screen.getByRole("tab", { name: "Participants" }))

      const { getByRole } = within(
        screen.getByRole("tabpanel", { name: "Participants" })
      )

      expect(
        getByRole("list", { name: "Participants" })
      ).toHaveAccessibleDescription("No participants, yet.")
    })

    it("lists all participants.", async () => {
      await renderChart({
        chart: {
          participants: [createParticipant({ name: "John" })],
        },
      })

      await userEvent.click(screen.getByRole("tab", { name: "Participants" }))

      const { getByRole } = within(
        screen.getByRole("list", { name: "Participants" })
      )

      expect(getByRole("listitem", { name: "John" })).toBeInTheDocument()
    })

    it("shows when a participant has voted.", async () => {
      const createdAt = new Date(2022, 8, 13, 20, 6)

      await renderChart({
        chart: {
          participants: [
            createParticipant({
              name: "John",
              createdAt: createdAt.toISOString(),
            }),
          ],
        },
      })

      await userEvent.click(screen.getByRole("tab", { name: "Participants" }))

      const { getByRole } = within(
        screen.getByRole("list", { name: "Participants" })
      )

      const formatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      })

      expect(
        getByRole("listitem", { name: "John" })
      ).toHaveAccessibleDescription(formatter.format(createdAt))
    })

    it("is possible to remove a participant.", async () => {
      const participant = createParticipant({ name: "John" })

      const removeMutation = deleteParticipantMock(participant.id)

      await renderChart({
        chart: {
          participants: [participant],
        },
        mocks: [removeMutation],
      })

      await userEvent.click(screen.getByRole("tab", { name: "Participants" }))

      const { getByRole } = within(
        screen.getByRole("listitem", { name: "John" })
      )

      await userEvent.click(getByRole("button", { name: "Remove" }))

      await finishMutations(removeMutation)

      expect(
        screen.getByRole("list", { name: "Participants" })
      ).toHaveAccessibleDescription("No participants, yet.")
    })

    it("disables the other participants when on is being deleted.", async () => {
      const john = createParticipant({ name: "John" })
      const jane = createParticipant({ name: "Jane" })

      const removeMutation = deleteParticipantMock(john.id)

      await renderChart({
        chart: {
          participants: [john, jane],
        },
        mocks: [removeMutation],
      })

      await userEvent.click(screen.getByRole("tab", { name: "Participants" }))

      await userEvent.click(
        within(screen.getByRole("listitem", { name: "John" })).getByRole(
          "button",
          { name: "Remove" }
        )
      )

      expect(
        within(screen.getByRole("listitem", { name: "Jane" })).getByRole(
          "button",
          { name: "Remove" }
        )
      ).toBeDisabled()
    })

    it("shows the selection of a participant on hover.", async () => {
      const dimensionA = createDimension()
      const dimensionB = createDimension()

      const john = createParticipant({
        name: "John",
        selections: [
          { dimensionId: dimensionA.id, value: 1 },
          { dimensionId: dimensionB.id, value: 2 },
        ],
      })

      await renderChart({
        chart: {
          dimensions: [dimensionA, dimensionB],
          participants: [john],
        },
      })

      await userEvent.click(screen.getByRole("tab", { name: "Participants" }))

      await userEvent.hover(screen.getByRole("listitem", { name: "John" }))

      expect(screen.getByRole("figure", { name: "John" })).toBeInTheDocument()
    })

    it("hides the selection of a participant when the user leaves it.", async () => {
      const dimensionA = createDimension()
      const dimensionB = createDimension()

      const john = createParticipant({
        name: "John",
        selections: [
          { dimensionId: dimensionA.id, value: 1 },
          { dimensionId: dimensionB.id, value: 2 },
        ],
      })

      await renderChart({
        chart: {
          dimensions: [dimensionA, dimensionB],
          participants: [john],
        },
      })

      await userEvent.click(screen.getByRole("tab", { name: "Participants" }))

      await userEvent.hover(screen.getByRole("listitem", { name: "John" }))
      await userEvent.unhover(screen.getByRole("listitem", { name: "John" }))

      expect(
        screen.queryByRole("figure", { name: "John" })
      ).not.toBeInTheDocument()
    })
  })
})
