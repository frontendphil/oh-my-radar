import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { DevConfiguration } from "./DevConfiguration"

describe("DevConfiguration", () => {
  it("is possible to change the title of the cart.", async () => {
    render(<DevConfiguration />)

    await userEvent.clear(screen.getByRole("textbox", { name: "Title" }))

    await userEvent.type(
      screen.getByRole("textbox", { name: "Title" }),
      "Changed title",
      {}
    )

    expect(
      screen.getByRole("figure", { name: "Changed title" })
    ).toBeInTheDocument()
  })

  describe("Dimensions", () => {
    const addDimension = async (name: string) => {
      await userEvent.type(
        screen.getByRole("textbox", { name: "Add dimension" }),
        `${name}{enter}`
      )
    }

    describe("Keyboard interaction", () => {
      const addDimension = async (name: string) => {
        await userEvent.type(
          screen.getByRole("textbox", { name: "Add dimension" }),
          `${name}{enter}`
        )
      }

      it('is possible to add dimensions with "Enter".', async () => {
        render(<DevConfiguration />)

        await userEvent.type(
          screen.getByRole("textbox", { name: "Add dimension" }),
          "New dimension{enter}"
        )

        expect(
          screen.getByRole("listitem", { name: "New dimension" })
        ).toBeInTheDocument()
        expect(
          screen.getByRole("radiogroup", { name: "New dimension" })
        ).toBeInTheDocument()
      })

      it("is not possible to add dimensions that already exist.", async () => {
        render(<DevConfiguration />)

        await addDimension("Test")
        await addDimension("Test")

        expect(screen.getAllByRole("listitem", { name: "Test" })).toHaveLength(
          1
        )
        expect(
          screen.getAllByRole("radiogroup", { name: "Test" })
        ).toHaveLength(1)
      })

      it("is not possible to add dimensions with an empty name.", async () => {
        render(<DevConfiguration />)

        await addDimension("")

        expect(
          screen.queryByRole("listbox", { name: "" })
        ).not.toBeInTheDocument()
        expect(
          screen.queryByRole("radiogroup", { name: "" })
        ).not.toBeInTheDocument()
      })

      it("clears the add input when a new dimension has been added.", async () => {
        render(<DevConfiguration />)

        await addDimension("Test")

        expect(
          screen.getByRole("textbox", { name: "Add dimension" })
        ).toHaveValue("")
      })
    })

    describe("Mouse interaction", () => {
      const addDimension = async (name: string) => {
        await userEvent.type(
          screen.getByRole("textbox", { name: "Add dimension" }),
          name
        )

        await userEvent.click(
          screen.getByRole("button", { name: `Add dimension "${name}"` })
        )
      }

      it('is possible to add new dimensions with the "Add" button.', async () => {
        render(<DevConfiguration />)

        await userEvent.type(
          screen.getByRole("textbox", { name: "Add dimension" }),
          "New dimension"
        )

        await userEvent.click(
          screen.getByRole("button", { name: `Add dimension "New dimension"` })
        )

        expect(
          screen.getByRole("listitem", { name: "New dimension" })
        ).toBeInTheDocument()
        expect(
          screen.getByRole("radiogroup", { name: "New dimension" })
        ).toBeInTheDocument()
      })

      it("is not possible to add dimensions that already exist.", async () => {
        render(<DevConfiguration />)

        await addDimension("Test")
        await addDimension("Test")

        expect(screen.getAllByRole("listitem", { name: "Test" })).toHaveLength(
          1
        )
        expect(
          screen.getAllByRole("radiogroup", { name: "Test" })
        ).toHaveLength(1)
      })

      it("is not possible to add dimensions with an empty name.", async () => {
        render(<DevConfiguration />)

        await addDimension(" ")

        expect(
          screen.queryByRole("listitem", { name: "" })
        ).not.toBeInTheDocument()
        expect(
          screen.queryByRole("radiogroup", { name: "" })
        ).not.toBeInTheDocument()
      })

      it("clears the add input when a new dimension has been added.", async () => {
        render(<DevConfiguration />)

        await addDimension("Test")

        expect(
          screen.getByRole("textbox", { name: "Add dimension" })
        ).toHaveValue("")
      })
    })

    it("is possible to remove dimensions.", async () => {
      render(<DevConfiguration />)

      await addDimension("Test")

      await userEvent.click(
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
    const addDimension = async (name: string) => {
      await userEvent.type(
        screen.getByRole("textbox", { name: "Add dimension" }),
        `${name}{enter}`
      )
    }

    const setMin = async (value: number) => {
      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Min value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Min value" }),
        value.toString()
      )
    }

    const setMax = async (value: number) => {
      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Max value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Max value" }),
        value.toString()
      )
    }

    it("is possible to change the upper bound of the selection range.", async () => {
      render(<DevConfiguration />)

      await addDimension("Test")

      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Max value" }),
        "10"
      )

      expect(
        screen.getByRole("radio", { name: "Test - 10" })
      ).toBeInTheDocument()
    })

    it("is possible to change the lower bound of the selection range", async () => {
      render(<DevConfiguration />)

      await addDimension("Test")

      await userEvent.clear(
        screen.getByRole("spinbutton", { name: "Min value" })
      )
      await userEvent.type(
        screen.getByRole("spinbutton", { name: "Min value" }),
        "0"
      )

      expect(
        screen.getByRole("radio", { name: "Test - 0" })
      ).toBeInTheDocument()
    })
  })

  describe("Selection", () => {
    const selectValues = async () => {
      await userEvent.click(screen.getByRole("radio", { name: "One - 1" }))
      await userEvent.click(screen.getByRole("radio", { name: "Two - 1" }))
      await userEvent.click(screen.getByRole("radio", { name: "Three - 1" }))
    }

    it("is possible to select a value.", async () => {
      render(<DevConfiguration />)

      await userEvent.click(screen.getByRole("radio", { name: "One - 1" }))

      expect(
        screen.getByRole("radio", { name: "One - 1", checked: true })
      ).toBeInTheDocument()
    })

    it("renders a figure when all options of a selection have been set.", async () => {
      render(<DevConfiguration />)

      await selectValues()

      expect(screen.getByRole("figure", { name: "john" })).toBeInTheDocument()
    })

    describe("Change the active selection", () => {
      const addSelection = async (value: string) => {
        await userEvent.type(
          screen.getByRole("textbox", { name: "Add a selection" }),
          `${value}{enter}`
        )
      }

      it("should be possible to change the active selection", async () => {
        render(<DevConfiguration />)

        await addSelection("jane")

        await userEvent.click(
          screen.getByRole("button", { name: `Activate "jane"` })
        )

        await selectValues()

        expect(screen.getByRole("figure", { name: "jane" })).toBeInTheDocument()
      })

      it("disables the button for the active selection.", async () => {
        render(<DevConfiguration />)

        await addSelection("jane")

        await userEvent.click(
          screen.getByRole("button", { name: `Activate "jane"` })
        )

        expect(
          screen.getByRole("button", { name: 'Activate "jane"' })
        ).toBeDisabled()
      })
    })

    describe("Selection color", () => {
      it("is possible to change the color of a selection.", async () => {
        render(<DevConfiguration />)

        await userEvent.click(
          screen.getByRole("button", { name: 'Color for "john"' })
        )

        await userEvent.click(screen.getByRole("option", { name: "Pink" }))

        await selectValues()

        expect(screen.getByRole("figure", { name: "john" })).toHaveAttribute(
          "class",
          expect.stringContaining("stroke-pink")
        )
        expect(screen.getByRole("figure", { name: "john" })).toHaveAttribute(
          "class",
          expect.stringContaining("fill-pink")
        )
      })
    })

    describe("Keyboard interaction", () => {
      const addSelection = async (value: string) => {
        await userEvent.type(
          screen.getByRole("textbox", { name: "Add a selection" }),
          `${value}{enter}`
        )
      }

      it("is possible to add a selection.", async () => {
        render(<DevConfiguration />)

        await userEvent.type(
          screen.getByRole("textbox", { name: "Add a selection" }),
          "jane{enter}"
        )

        expect(
          screen.getByRole("listitem", { name: "jane" })
        ).toBeInTheDocument()
      })

      it("clears the input after a new selection was added.", async () => {
        render(<DevConfiguration />)

        await addSelection("jane")

        expect(
          screen.getByRole("textbox", { name: "Add a selection" })
        ).toHaveValue("")
      })
    })
  })
})
