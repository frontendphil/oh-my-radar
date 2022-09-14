import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { RadarChart } from "./RadarChart"
import { Selection } from "./Selection"

describe("RadarChart", () => {
  const defaultDimension = {
    id: "height",
    title: "Height",
  }

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
        <RadarChart title="Test" dimensions={[defaultDimension]} range={[0, 1]}>
          <Selection name="test" />
        </RadarChart>
      )

      expect(
        screen.getByRole("radiogroup", {
          name: `test: ${defaultDimension.title}`,
        })
      ).toBeInTheDocument()
    })
  })

  describe("Selection", () => {
    it("is possible to select a value for a given dimension.", async () => {
      const onChange = jest.fn()

      render(
        <RadarChart title="Test" dimensions={[defaultDimension]} range={[1, 2]}>
          <Selection active name="test" onChange={onChange} />
        </RadarChart>
      )

      const { getByRole } = within(
        screen.getByRole("radiogroup", {
          name: `test: ${defaultDimension.title}`,
        })
      )

      await userEvent.click(getByRole("radio", { name: `1` }))

      expect(onChange).toHaveBeenCalledWith({ [defaultDimension.id]: 1 })
    })

    it("is only possible to interact with active selections.", async () => {
      const onChangeThatShouldBeCalled = jest.fn()

      render(
        <RadarChart title="Test" dimensions={[defaultDimension]} range={[1, 2]}>
          <Selection
            active
            name="active"
            onChange={onChangeThatShouldBeCalled}
          />
          <Selection name="inactive" />
        </RadarChart>
      )

      const { queryByRole } = within(
        screen.getByRole("radiogroup", {
          name: `inactive: ${defaultDimension.title}`,
        })
      )

      expect(queryByRole("radio", { name: "1" })).not.toBeInTheDocument()
    })

    it("is not possible to change inactive selections.", async () => {
      render(
        <RadarChart title="Test" dimensions={[defaultDimension]} range={[1, 2]}>
          <Selection name="test" />
        </RadarChart>
      )

      expect(
        screen.queryByRole("radio", {
          name: `${defaultDimension.title} - 1`,
        })
      ).not.toBeInTheDocument()
    })
  })
})
