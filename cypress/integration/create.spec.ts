describe("Create", () => {
  it("is possible to create a new chart.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create new chart" }).click()

    cy.findByRole("figure", { name: "New chart" }).should("exist")
  })
})
