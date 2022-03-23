import { fireEvent, render, screen } from "@testing-library/react"
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

  it("is possible to select a value in a dimension.", () => {
    render(<RadarChart title="Test" dimensions={["Height"]} scale={[1, 2]} />)

    fireEvent.click(screen.getByRole("checkbox", { name: "Height - 1" }))

    expect(
      screen.getByRole("checkbox", { name: "Height - 1", checked: true })
    ).toBeInTheDocument()
  })

  it("is possible to deselect a value in a dimension.", () => {
    render(<RadarChart title="Test" dimensions={["Height"]} scale={[1, 2]} />)

    fireEvent.click(screen.getByRole("checkbox", { name: "Height - 1" }))
    fireEvent.click(screen.getByRole("checkbox", { name: "Height - 1" }))

    expect(
      screen.getByRole("checkbox", { name: "Height - 1", checked: false })
    ).toBeInTheDocument()
  })
})
