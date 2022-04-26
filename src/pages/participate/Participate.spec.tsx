import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { v4 } from "uuid"
import { Colors } from "../../radar-chart"
import { finishMutations, finishQueries, render } from "../test-utils"
import { Participate } from "./Participate"
import { createChart, createDimension } from "./test-utils"
import {
  InsertParticipantDocument,
  InsertSelectionsDocument,
  ParticipantGetChartDocument,
  ParticipantGetChartQuery,
  Participants_Set_Input,
  Selection_Set_Input,
} from "./api"

describe("Participate", () => {
  const getChartMock = (
    id: string,
    charts_by_pk: ParticipantGetChartQuery["charts_by_pk"]
  ) => ({
    request: {
      query: ParticipantGetChartDocument,
      variables: {
        id,
      },
    },
    result: {
      data: {
        charts_by_pk,
      },
    },
  })

  const insertParticipantMock = (participant: Participants_Set_Input) => ({
    request: {
      query: InsertParticipantDocument,
      variables: { participant },
    },
    result: {
      data: {
        insert_participants_one: {
          id: v4(),
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
      const chart = createChart({ dimensions })
      const chartMock = getChartMock("chart-id", chart)

      render(<Participate />, {
        mocks: [chartMock],
        path: "/participate/:id",
        route: "/participate/chart-id",
      })

      await finishQueries(chartMock)

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
      const chart = createChart({ dimensions })
      const chartMock = getChartMock("chart-id", chart)

      const participantMock = insertParticipantMock({
        name: "John Doe",
        chartId: "chart-id",
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
          chartId: "chart-id",
          dimensionId: dimensionOne.id,
          participantId,
          value: 1,
        },
        {
          chartId: "chart-id",
          dimensionId: dimensionTwo.id,
          participantId,
          value: 1,
        },
        {
          chartId: "chart-id",
          dimensionId: dimensionThree.id,
          participantId,
          value: 1,
        },
      ])

      render(<Participate />, {
        mocks: [chartMock, participantMock, selectionsMock],
        path: "/participate/:id",
        route: "/participate/chart-id",
      })

      await finishQueries(chartMock)

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
})
