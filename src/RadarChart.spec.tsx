import { render, screen } from "@testing-library/react"
import { RadarChart } from "./RadarChart"

describe("RadarChart", () => {
  it("renders a chat with a title.", () => {
    render(<RadarChart title="Test" dimensions={[]} scale={[]} />)

    expect(screen.getByRole("figure", { name: "Test" })).toBeInTheDocument()
  })

  it("is possible to select a value for a given dimension.", () => {
    render(<RadarChart title="Test" dimensions={["Height"]} scale={[1, 2]} />)

    expect(
      screen.getByRole("checkbox", { name: `Height - 1` })
    ).toBeInTheDocument()
  })
})
