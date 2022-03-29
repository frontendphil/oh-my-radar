import { fireEvent, render, screen } from "@testing-library/react"
import { RadarChart } from "./RadarChart"
import { Selection } from "./Selection"

describe("RadarChart", () => {
  it("renders a chat with a title.", () => {
    render(
      <RadarChart title="Test" dimensions={[]} range={[0, 1]}>
        <Selection name="test" value={{}} />
      </RadarChart>
    )

    expect(screen.getByRole("figure", { name: "Test" })).toBeInTheDocument()
  })

  it("renders dimensions.", () => {
    render(
      <RadarChart title="Test" dimensions={["Height"]} range={[0, 1]}>
        <Selection name="test" value={{}} />
      </RadarChart>
    )

    expect(
      screen.getByRole("radiogroup", { name: "Height" })
    ).toBeInTheDocument()
  })

  it("is possible to select a value for a given dimension.", () => {
    render(
      <RadarChart title="Test" dimensions={["Height"]} range={[1, 2]}>
        <Selection name="test" value={{}} />
      </RadarChart>
    )

    expect(
      screen.getByRole("radio", { name: `Height - 1` })
    ).toBeInTheDocument()
  })

  it("is possible to select a value in a dimension.", () => {
    render(
      <RadarChart title="Test" dimensions={["Height"]} range={[1, 2]}>
        <Selection name="test" value={{ Height: 1 }} />
      </RadarChart>
    )

    expect(
      screen.getByRole("radio", { name: "Height - 1", checked: true })
    ).toBeInTheDocument()
  })

  describe("Selection", () => {
    it("notifies when the user makes a selection.", () => {
      const onChange = jest.fn()

      render(
        <RadarChart title="Test" dimensions={["Height"]} range={[1, 2]}>
          <Selection name="test" value={{}} onChange={onChange} />
        </RadarChart>
      )

      fireEvent.click(screen.getByRole("radio", { name: "Height - 1" }))

      expect(onChange).toHaveBeenCalledWith({ Height: 1 })
    })
  })
})
