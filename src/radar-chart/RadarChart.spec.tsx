import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RadarChart } from "./RadarChart"
import { Selection } from "./Selection"

describe("RadarChart", () => {
  it("renders a chart with a title.", () => {
    render(
      <RadarChart title="Test" dimensions={[]} range={[0, 1]}>
        <Selection name="test" />
      </RadarChart>
    )

    expect(screen.getByRole("figure", { name: "Test" })).toBeInTheDocument()
  })

  describe("Dimensions", () => {
    it("renders dimensions.", () => {
      render(
        <RadarChart title="Test" dimensions={["Height"]} range={[0, 1]}>
          <Selection name="test" />
        </RadarChart>
      )

      expect(
        screen.getByRole("radiogroup", { name: "Height" })
      ).toBeInTheDocument()
    })
  })

  describe("Selection", () => {
    it("is possible to select a value for a given dimension.", async () => {
      const onChange = jest.fn()

      render(
        <RadarChart title="Test" dimensions={["Height"]} range={[1, 2]}>
          <Selection active name="test" onChange={onChange} />
        </RadarChart>
      )

      await userEvent.click(screen.getByRole("radio", { name: "Height - 1" }))

      expect(onChange).toHaveBeenCalledWith({ Height: 1 })
    })

    it("is only possible to interact with active selections.", async () => {
      const onChangeThatShouldBeCalled = jest.fn()
      const onChangeThatShouldNotBeCalled = jest.fn()

      render(
        <RadarChart title="Test" dimensions={["Height"]} range={[1, 2]}>
          <Selection
            active
            name="active"
            onChange={onChangeThatShouldBeCalled}
          />
          <Selection name="inactive" onChange={onChangeThatShouldNotBeCalled} />
        </RadarChart>
      )

      await userEvent.click(screen.getByRole("radio", { name: "Height - 1" }))

      expect(onChangeThatShouldNotBeCalled).not.toHaveBeenCalled()
      expect(onChangeThatShouldBeCalled).toHaveBeenCalled()
    })

    it("is not possible to change inactive selections.", async () => {
      const onChange = jest.fn()

      render(
        <RadarChart title="Test" dimensions={["Height"]} range={[1, 2]}>
          <Selection name="test" onChange={onChange} />
        </RadarChart>
      )

      await userEvent.click(
        screen.getByRole("presentation", { name: "Height - 1" })
      )

      expect(onChange).not.toHaveBeenCalled()
    })
  })
})
