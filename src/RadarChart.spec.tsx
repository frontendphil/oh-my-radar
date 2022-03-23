import { render, screen } from "@testing-library/react"
import { RadarChart } from "./RadarChart"

describe("RadarChart", () => {
  it("renders a chat with a title.", () => {
    render(<RadarChart title="Test" />)

    expect(screen.getByRole("figure", { name: "Test" })).toBeInTheDocument()
  })
})
