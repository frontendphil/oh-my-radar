import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Colors } from "@radar/chart"
import { finishMutations, uuid } from "../test-utils"
import { createDimension, renderChart } from "./test-utils"
import {
  InsertParticipantDocument,
  InsertSelectionsDocument,
  Participants_Set_Input,
  Selection_Set_Input,
} from "./api"

describe("Participate", () => {
  const insertParticipantMock = (participant: Participants_Set_Input) => ({
    request: {
      query: InsertParticipantDocument,
      variables: { participant },
    },
    result: {
      data: {
        insert_participants_one: {
          id: uuid(),
        },
      },
    },
  })

  const insertSelectionsMock = (selections: Selection_Set_Input[]) => ({
    request: {
      query: InsertSelectionsDocument,
      variables: {
        selections,
      },
    },
    result: {
      data: {
        insert_selection: {
          returning: [],
        },
      },
    },
  })

  describe("Selection", () => {
    const dimensionOne = createDimension({ title: "One" })
    const dimensionTwo = createDimension({ title: "Two" })
    const dimensionThree = createDimension({ title: "Three" })

    const dimensions = [dimensionOne, dimensionTwo, dimensionThree]

    const selectValues = async () => {
      await userEvent.click(screen.getByRole("radio", { name: "One - 1" }))
      await userEvent.click(screen.getByRole("radio", { name: "Two - 1" }))
      await userEvent.click(screen.getByRole("radio", { name: "Three - 1" }))
    }

    it("is possible to make a selection.", async () => {
      await renderChart({ chart: { dimensions } })

      await selectValues()

      await finishMutations()

      expect(
        screen.getByRole("radio", { name: "One - 1", checked: true })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("radio", { name: "Two - 1", checked: true })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("radio", { name: "Three - 1", checked: true })
      ).toBeInTheDocument()
    })

    it("it creates all necessary data when the user hits submit.", async () => {
      const chartId = "chart-id"

      const participantMock = insertParticipantMock({
        name: "John Doe",
        chartId,
        color: Colors.blue,
      })

      const {
        result: {
          data: {
            insert_participants_one: { id: participantId },
          },
        },
      } = participantMock

      const selectionsMock = insertSelectionsMock([
        {
          chartId,
          dimensionId: dimensionOne.id,
          participantId,
          value: 1,
        },
        {
          chartId,
          dimensionId: dimensionTwo.id,
          participantId,
          value: 1,
        },
        {
          chartId,
          dimensionId: dimensionThree.id,
          participantId,
          value: 1,
        },
      ])

      await renderChart({
        chartId,
        chart: { dimensions },
        mocks: [participantMock, selectionsMock],
      })

      await selectValues()

      await userEvent.type(
        screen.getByRole("textbox", { name: "Name" }),
        "John Doe"
      )

      await userEvent.click(screen.getByRole("button", { name: "Submit" }))

      await finishMutations(participantMock, selectionsMock)

      expect(screen.getByText("Thank you")).toBeInTheDocument()
    })
  })

  it("disabled the submit button when the user has not made a complete selection.", async () => {
    const dimensionOne = createDimension({ title: "One" })
    const dimensionTwo = createDimension({ title: "Two" })
    const dimensionThree = createDimension({ title: "Three" })

    const dimensions = [dimensionOne, dimensionTwo, dimensionThree]

    await renderChart({ chart: { dimensions } })

    await userEvent.type(
      screen.getByRole("textbox", { name: "Name" }),
      "John Doe"
    )

    await userEvent.click(screen.getByRole("radio", { name: "One - 1" }))
    await userEvent.click(screen.getByRole("radio", { name: "Two - 1" }))

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled()
  })

  it("disables the submit button when the user has not entered a name.", async () => {
    await renderChart()

    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled()
  })

  it("enables the submit button when the user has entered a name.", async () => {
    await renderChart()

    await userEvent.type(
      screen.getByRole("textbox", { name: "Name" }),
      "John Doe"
    )

    expect(screen.getByRole("button", { name: "Submit" })).toBeEnabled()
  })
})
