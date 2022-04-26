import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Dimensions } from "./Dimensions"

describe("Dimensions", () => {
  describe("Keyboard interaction", () => {
    const addDimension = async (name: string) => {
      await userEvent.type(
        screen.getByRole("textbox", { name: "Add dimension" }),
        `${name}{enter}`
      )
    }

    it('is possible to add dimensions with "Enter".', async () => {
      const onAdd = jest.fn()

      render(<Dimensions dimensions={[]} onAdd={onAdd} onRemove={jest.fn()} />)

      await addDimension("New dimension")

      expect(onAdd).toHaveBeenCalledWith({ title: "New dimension" })
    })

    it("is not possible to add dimensions that already exist.", async () => {
      const dimension = { id: "dimension", title: "Dimension" }

      const onAdd = jest.fn()

      render(
        <Dimensions
          dimensions={[dimension]}
          onAdd={onAdd}
          onRemove={jest.fn()}
        />
      )

      await addDimension("Dimension")

      expect(onAdd).not.toHaveBeenCalled()
    })

    it("is not possible to add dimensions with an empty name.", async () => {
      const onAdd = jest.fn()

      render(<Dimensions dimensions={[]} onAdd={onAdd} onRemove={jest.fn()} />)

      await addDimension(" ")

      expect(onAdd).not.toHaveBeenCalled()
    })

    it("clears the add input when a new dimension has been added.", async () => {
      render(
        <Dimensions dimensions={[]} onAdd={jest.fn()} onRemove={jest.fn()} />
      )

      await addDimension("New dimension")

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
      const onAdd = jest.fn()

      render(<Dimensions dimensions={[]} onAdd={onAdd} onRemove={jest.fn()} />)

      await addDimension("New dimension")

      expect(onAdd).toHaveBeenCalledWith({ title: "New dimension" })
    })

    it("is not possible to add dimensions that already exist.", async () => {
      const onAdd = jest.fn()

      render(
        <Dimensions
          dimensions={[{ id: "dimension", title: "Dimension" }]}
          onAdd={onAdd}
          onRemove={jest.fn()}
        />
      )

      await addDimension("Dimension")

      expect(onAdd).not.toHaveBeenCalled()
    })

    it("is not possible to add dimensions with an empty name.", async () => {
      const onAdd = jest.fn()

      render(<Dimensions dimensions={[]} onAdd={onAdd} onRemove={jest.fn()} />)

      await addDimension(" ")

      expect(onAdd).not.toHaveBeenCalled()
    })

    it("clears the add input when a new dimension has been added.", async () => {
      render(
        <Dimensions dimensions={[]} onAdd={jest.fn()} onRemove={jest.fn()} />
      )

      await addDimension("Test")

      expect(
        screen.getByRole("textbox", { name: "Add dimension" })
      ).toHaveValue("")
    })

    describe("Remove", () => {
      it("is possible to remove dimensions.", async () => {
        const onRemove = jest.fn()

        render(
          <Dimensions
            dimensions={[{ id: "dimension-id", title: "Dimension" }]}
            onAdd={jest.fn()}
            onRemove={onRemove}
          />
        )

        await userEvent.click(
          screen.getByRole("button", { name: `Remove dimension "Dimension"` })
        )

        expect(onRemove).toHaveBeenCalledWith("dimension-id")
      })
    })
  })
})
