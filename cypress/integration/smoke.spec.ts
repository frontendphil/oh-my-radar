describe("Smoke test", () => {
  it("shows the application", () => {
    cy.visit("/")

    cy.findByRole("figure", { name: "Test" }).should("exist")
  })

  it("renders selections correctly.", () => {
    cy.visit("/")

    cy.findByRole("radio", { name: "One - 1" }).click()
    cy.findByRole("radio", { name: "Two - 2" }).click()
    cy.findByRole("radio", { name: "Three - 3" }).click()

    cy.findByRole("figure", { name: "john" }).should("exist")

    cy.percySnapshot()
  })
})
