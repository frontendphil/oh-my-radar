describe("Create", () => {
  it("is possible to create a new chart.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create new chart" }).click()

    cy.findByRole("figure", { name: "New chart" }).should("exist")
  })

  it("creates default dimensions for a chart.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create new chart" }).click()

    cy.waitFor("network")

    cy.findByRole("figure", { name: "One" }).should("exist")
    cy.findByRole("figure", { name: "Two" }).should("exist")
    cy.findByRole("figure", { name: "Three" }).should("exist")
  })
})
