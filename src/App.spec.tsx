import { fireEvent, render, screen } from "@testing-library/react"
import { App } from "./App"

describe("App", () => {
  it("is possible to change the title of the cart.", () => {
    render(<App />)

    fireEvent.change(screen.getByRole("textbox", { name: "Title" }), {
      target: { value: "Changed title" },
    })

    expect(
      screen.getByRole("figure", { name: "Changed title" })
    ).toBeInTheDocument()
  })

  describe("Dimensions", () => {
    const addDimension = (name: string) => {
      fireEvent.change(screen.getByRole("textbox", { name: "Add dimension" }), {
        target: { value: name },
      })
      fireEvent.keyUp(screen.getByRole("textbox", { name: "Add dimension" }), {
        target: screen.getByRole("textbox", { name: "Add dimension" }),
        key: "Enter",
      })
    }

    it("is possible to add dimensions.", () => {
      render(<App />)

      fireEvent.change(screen.getByRole("textbox", { name: "Add dimension" }), {
        target: { value: "New dimension" },
      })
      fireEvent.keyUp(screen.getByRole("textbox", { name: "Add dimension" }), {
        target: screen.getByRole("textbox", { name: "Add dimension" }),
        key: "Enter",
      })

      expect(
        screen.getByRole("listitem", { name: "New dimension" })
      ).toBeInTheDocument()
      expect(
        screen.getByRole("radiogroup", { name: "New dimension" })
      ).toBeInTheDocument()
    })

    it("is possible to remove dimensions.", () => {
      render(<App />)

      addDimension("Test")

      fireEvent.click(
        screen.getByRole("button", { name: `Remove dimension "Test"` })
      )

      expect(
        screen.queryByRole("listitem", { name: "Test" })
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole("radiogroup", { name: "Test" })
      ).not.toBeInTheDocument()
    })

    it.todo('is possible to add new dimensions with "Enter".')
    it.todo('is possible to add a new dimension by clicking "Add".')
    it.todo("is not possible to add dimensions that already exist.")
    it.todo("is not possible to add dimensions with an empty name.")
    it.todo("clears the add input when a new dimension has been added.")
  })

  describe("Range", () => {
    it.todo("is possible to change the upper bound of the selection range.")
    it.todo("is possible to change the lower bound of the selection range")
    it.todo(
      "is not possible to enter an upper bound that is below the lower bound."
    )
    it.todo(
      "is not possible to enter a lower bound that is greater than the upper bound."
    )
  })
})
