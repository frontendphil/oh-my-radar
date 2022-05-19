describe("Create", () => {
  it("is possible to create a new chart.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create your own chart" }).should("exist")
  })

  it("creates default dimensions and range for a chart.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create your own chart" }).click()

    cy.waitFor("network")

    cy.findByRole("figure", { name: "One" }).should("exist")
    cy.findByRole("radio", { name: "One - 1" }).should("exist")
    cy.findByRole("radio", { name: "One - 4" }).should("exist")

    cy.findByRole("figure", { name: "Two" }).should("exist")
    cy.findByRole("radio", { name: "Two - 1" }).should("exist")
    cy.findByRole("radio", { name: "Two - 4" }).should("exist")

    cy.findByRole("figure", { name: "Three" }).should("exist")
    cy.findByRole("radio", { name: "Three - 1" }).should("exist")
    cy.findByRole("radio", { name: "Three - 4" }).should("exist")
  })
})