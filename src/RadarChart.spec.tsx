import { fireEvent, render, screen } from "@testing-library/react"
import { RadarChart } from "./RadarChart"

describe("RadarChart", () => {
  it("renders a chat with a title.", () => {
    render(<RadarChart title="Test" dimensions={[]} range={[0, 1]} />)

    expect(screen.getByRole("figure", { name: "Test" })).toBeInTheDocument()
  })

  it("renders dimensions.", () => {
    render(<RadarChart title="Test" dimensions={["Height"]} range={[0, 1]} />)

    expect(
      screen.getByRole("radiogroup", { name: "Height" })
    ).toBeInTheDocument()
  })

  it("is possible to select a value for a given dimension.", () => {
    render(<RadarChart title="Test" dimensions={["Height"]} range={[1, 2]} />)

    expect(
      screen.getByRole("radio", { name: `Height - 1` })
    ).toBeInTheDocument()
  })

  it("is possible to select a value in a dimension.", () => {
    render(<RadarChart title="Test" dimensions={["Height"]} range={[1, 2]} />)

    fireEvent.click(screen.getByRole("radio", { name: "Height - 1" }))

    expect(
      screen.getByRole("radio", { name: "Height - 1", checked: true })
    ).toBeInTheDocument()
  })

  it("can only give one selected value at a time.", () => {
    render(<RadarChart title="Test" dimensions={["Height"]} range={[1, 2]} />)

    fireEvent.click(screen.getByRole("radio", { name: "Height - 1" }))
    fireEvent.click(screen.getByRole("radio", { name: "Height - 2" }))

    expect(
      screen.getByRole("radio", { name: "Height - 1", checked: false })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("radio", { name: "Height - 2", checked: true })
    ).toBeInTheDocument()
  })
})
