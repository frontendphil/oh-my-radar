import { screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { finishMutations, uuid } from "../test-utils"
import {
  createChart,
  createDimension,
  createParticipant,
  renderChart,
} from "./test-utils"
import {
  Charts_Set_Input,
  DeleteDimensionDocument,
  DeleteParticipantDocument,
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
        update_charts_by_pk: { __typename: "charts", id, ...payload },
      },
    },
  })

  describe("Configuration", () => {
    describe("Title", () => {
      it("is possible to change the title of the cart.", async () => {
        const chart = createChart({ id: chartId, title: "Initial title" })
        const updateMock = mutateChartMock(chart.id, {
          title: "Changed title",
          min: chart.min,
          max: chart.max,
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

          await renderChart({ mocks: [insertMock], chart: { id: chartId } })

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

          await renderChart({ mocks: [insertMock], chart: { id: chartId } })

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
        const chart = createChart({ id: chartId, dimensions })

        const updateMock = mutateChartMock(chart.id, {
          title: chart.title,
          min: chart.min,
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

        const updateMock = mutateChartMock(chart.id, {
          title: chart.title,
          max: chart.max,
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

        const updateMock = mutateChartMock(chart.id, {
          title: chart.title,
          min: chart.min,
          max: chart.max,
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

        const updateMock = mutateChartMock(chart.id, {
          title: chart.title,
          max: chart.max,
          min: chart.min,
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
