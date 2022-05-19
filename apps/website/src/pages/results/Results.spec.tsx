import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import {
  createAverage,
  createDimension,
  createParticipant,
  createSelection,
  renderChart,
} from "./test-utils"

describe("Results", () => {
  const dimensionOne = createDimension({
    id: "one",
    title: "One",
    ...createAverage(1),
  })
  const dimensionTwo = createDimension({
    id: "two",
    title: "Two",
    ...createAverage(1),
  })
  const dimensionThree = createDimension({
    id: "three",
    title: "Three",
    ...createAverage(1),
  })

  const dimensions = [dimensionOne, dimensionTwo, dimensionThree]

  const participant = createParticipant({
    selections: [
      createSelection({ dimensionId: dimensionOne.id, value: 1 }),
      createSelection({ dimensionId: dimensionTwo.id, value: 1 }),
      createSelection({ dimensionId: dimensionThree.id, value: 1 }),
    ],
  })

  const participants = [participant]

  it("renders a figure when all options of a selection have been set.", async () => {
    await renderChart({
      chart: {
        dimensions,
        participants,
      },
    })

    expect(
      screen.getByRole("figure", { name: participant.name })
    ).toBeInTheDocument()
  })

  it("activates participants by default.", async () => {
    await renderChart({ chart: { dimensions, participants } })

    expect(
      screen.getByRole("checkbox", { name: participant.name })
    ).toBeChecked()
  })

  it("is possible to hide the result of a participant.", async () => {
    await renderChart({ chart: { dimensions, participants } })

    await userEvent.click(
      screen.getByRole("checkbox", { name: participant.name })
    )

    expect(
      screen.queryByRole("figure", { name: participant.name })
    ).not.toBeInTheDocument()
  })

  it("shows a message when no one has submitted something.", async () => {
    await renderChart({ chart: { dimensions, participants: [] } })

    expect(screen.getByText("No submissions yet")).toBeInTheDocument()
  })

  describe("Average", () => {
    it("is disabled by default.", async () => {
      await renderChart({ chart: { dimensions, participants } })

      expect(
        screen.queryByRole("checkbox", { name: "Average" })
      ).not.toBeChecked()
    })

    it("is possible to view the average of all responses.", async () => {
      await renderChart({ chart: { dimensions, participants } })

      await userEvent.click(screen.getByRole("checkbox", { name: "Average" }))

      expect(
        screen.getByRole("figure", { name: "Average" })
      ).toBeInTheDocument()
    })
  })
})