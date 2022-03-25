describe("App", () => {
  it.todo("is possible to change the title of the cart.")

  describe("Dimensions", () => {
    it.todo("is possible to add dimensions.")
    it.todo("is possible to remove dimensions.")
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
