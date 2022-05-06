import { screen } from "@testing-library/react"

import {
  createDimension,
  createParticipant,
  createSelection,
  renderChart,
} from "./test-utils"

describe("Results", () => {
  it("renders a figure when all options of a selection have been set.", async () => {
    const dimensionOne = createDimension({ title: "One" })
    const dimensionTwo = createDimension({ title: "Two" })
    const dimensionThree = createDimension({ title: "Three" })

    const participant = createParticipant({
      selections: [
        createSelection({ dimensionId: dimensionOne.id, value: 1 }),
        createSelection({ dimensionId: dimensionTwo.id, value: 1 }),
        createSelection({ dimensionId: dimensionThree.id, value: 1 }),
      ],
    })

    await renderChart({
      chart: {
        dimensions: [dimensionOne, dimensionTwo, dimensionThree],
        participants: [participant],
      },
    })

    expect(screen.getByRole("figure", { name: "John Doe" })).toBeInTheDocument()
  })
})
