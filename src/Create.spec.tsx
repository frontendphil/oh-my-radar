import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Create } from "./Create"

describe("Create", () => {
  it("renders a button to create a new chart.", () => {
    render(<Create />)

    expect(
      screen.getByRole("button", { name: "Create new chart" })
    ).toBeInTheDocument()
  })

  it("shows a loading state on the button while creating a new chart.", async () => {
    render(<Create />)

    await userEvent.click(
      screen.getByRole("button", { name: "Create new chart" })
    )

    expect(
      screen.getByRole("button", {
        name: "Creating your chart...",
      })
    ).toBeInTheDocument()
  })

  it("redirects to the chart admin when a chart has been created.", async () => {
    render(<Create />)

    await userEvent.click(
      screen.getByRole("button", { name: "Create new chart" })
    )

    expect(
      screen.getByRole("figure", { name: "New chart" })
    ).toBeInTheDocument()
  })
})
