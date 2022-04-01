import { render, screen } from "@testing-library/react"
import { getPoint } from "../getPoint"
import { RadarChart } from "../RadarChart"
import { STEP_RADIUS } from "../Step"
import { getDimensionAngle } from "../utils"
import { SelectionAverage } from "./SelectionAverage"

describe("SelectionAverage", () => {
  it("renders a plane with an average of all selections.", () => {
    const selections = [
      {
        Height: 4,
      },
      {
        Height: 2,
      },
    ]

    render(
      <RadarChart
        size={500}
        title="Test"
        range={[1, 4]}
        dimensions={["Height"]}
      >
        <SelectionAverage selections={selections} />
      </RadarChart>
    )

    const point = getPoint({
      value: (4 + 2) / 2,
      range: [1, 4],
      diagramWidth: 500 - 2 * STEP_RADIUS,
      angle: getDimensionAngle(["Height"], 0),
    })

    expect(screen.getByRole("figure", { name: "Average" })).toHaveAttribute(
      "d",
      `M ${point.x},${point.y} z`
    )
  })
})
