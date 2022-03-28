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

    describe("Keyboard interaction", () => {
      const addDimension = (name: string) => {
        fireEvent.change(
          screen.getByRole("textbox", { name: "Add dimension" }),
          {
            target: { value: name },
          }
        )
        fireEvent.keyUp(
          screen.getByRole("textbox", { name: "Add dimension" }),
          {
            target: screen.getByRole("textbox", { name: "Add dimension" }),
            key: "Enter",
          }
        )
      }

      it('is possible to add dimensions with "Enter".', () => {
        render(<App />)

        fireEvent.change(
          screen.getByRole("textbox", { name: "Add dimension" }),
          {
            target: { value: "New dimension" },
          }
        )
        fireEvent.keyUp(
          screen.getByRole("textbox", { name: "Add dimension" }),
          {
            target: screen.getByRole("textbox", { name: "Add dimension" }),
            key: "Enter",
          }
        )

        expect(
          screen.getByRole("listitem", { name: "New dimension" })
        ).toBeInTheDocument()
        expect(
          screen.getByRole("radiogroup", { name: "New dimension" })
        ).toBeInTheDocument()
      })

      it("is not possible to add dimensions that already exist.", () => {
        render(<App />)

        addDimension("Test")
        addDimension("Test")

        expect(screen.getAllByRole("listitem", { name: "Test" })).toHaveLength(
          1
        )
        expect(
          screen.getAllByRole("radiogroup", { name: "Test" })
        ).toHaveLength(1)
      })

      it("is not possible to add dimensions with an empty name.", () => {
        render(<App />)

        addDimension("")

        expect(
          screen.queryByRole("listbox", { name: "" })
        ).not.toBeInTheDocument()
        expect(
          screen.queryByRole("radiogroup", { name: "" })
        ).not.toBeInTheDocument()
      })

      it("clears the add input when a new dimension has been added.", () => {
        render(<App />)

        addDimension("Test")

        expect(
          screen.getByRole("textbox", { name: "Add dimension" })
        ).toHaveValue("")
      })
    })

    describe("Mouse interaction", () => {
      const addDimension = (name: string) => {
        fireEvent.change(
          screen.getByRole("textbox", { name: "Add dimension" }),
          {
            target: { value: name },
          }
        )
        fireEvent.click(
          screen.getByRole("button", { name: `Add dimension "${name}"` })
        )
      }

      it('is possible to add new dimensions with the "Add" button.', () => {
        render(<App />)

        fireEvent.change(
          screen.getByRole("textbox", { name: "Add dimension" }),
          {
            target: { value: "New dimension" },
          }
        )
        fireEvent.click(
          screen.getByRole("button", { name: `Add dimension "New dimension"` })
        )

        expect(
          screen.getByRole("listitem", { name: "New dimension" })
        ).toBeInTheDocument()
        expect(
          screen.getByRole("radiogroup", { name: "New dimension" })
        ).toBeInTheDocument()
      })

      it("is not possible to add dimensions that already exist.", () => {
        render(<App />)

        addDimension("Test")
        addDimension("Test")

        expect(screen.getAllByRole("listitem", { name: "Test" })).toHaveLength(
          1
        )
        expect(
          screen.getAllByRole("radiogroup", { name: "Test" })
        ).toHaveLength(1)
      })

      it("is not possible to add dimensions with an empty name.", () => {
        render(<App />)

        addDimension("")

        expect(
          screen.queryByRole("listitem", { name: "" })
        ).not.toBeInTheDocument()
        expect(
          screen.queryByRole("radiogroup", { name: "" })
        ).not.toBeInTheDocument()
      })

      it("clears the add input when a new dimension has been added.", () => {
        render(<App />)

        addDimension("Test")

        expect(
          screen.getByRole("textbox", { name: "Add dimension" })
        ).toHaveValue("")
      })
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
  })

  describe("Range", () => {
    const addDimension = (name: string) => {
      fireEvent.change(screen.getByRole("textbox", { name: "Add dimension" }), {
        target: { value: name },
      })
      fireEvent.keyUp(screen.getByRole("textbox", { name: "Add dimension" }), {
        target: screen.getByRole("textbox", { name: "Add dimension" }),
        key: "Enter",
      })
    }

    const setMin = (value: number) => {
      fireEvent.change(screen.getByRole("spinbutton", { name: "Min value" }), {
        target: { value: value.toString() },
      })
    }

    const setMax = (value: number) => {
      fireEvent.change(screen.getByRole("spinbutton", { name: "Max value" }), {
        target: { value: value.toString() },
      })
    }

    it("is possible to change the upper bound of the selection range.", () => {
      render(<App />)

      addDimension("Test")

      fireEvent.change(screen.getByRole("spinbutton", { name: "Max value" }), {
        target: { value: "10" },
      })

      expect(
        screen.getByRole("radio", { name: "Test - 10" })
      ).toBeInTheDocument()
    })

    it("is possible to change the lower bound of the selection range", () => {
      render(<App />)

      addDimension("Test")

      fireEvent.change(screen.getByRole("spinbutton", { name: "Min value" }), {
        target: { value: "0" },
      })

      expect(
        screen.getByRole("radio", { name: "Test - 0" })
      ).toBeInTheDocument()
    })

    it("is not possible to enter an upper bound that is below the lower bound.", () => {
      render(<App />)

      setMin(4)
      setMax(3)

      expect(screen.getByRole("spinbutton", { name: "Max value" })).toHaveValue(
        4
      )
    })
    it.todo(
      "is not possible to enter a lower bound that is greater than the upper bound."
    )
  })
})
