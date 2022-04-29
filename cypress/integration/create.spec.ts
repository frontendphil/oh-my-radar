describe("Create", () => {
  it("is possible to create a new chart.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create new chart" }).should("exist")

    cy.percySnapshot()
  })

  it("creates default dimensions and range for a chart.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create new chart" }).click()

    cy.waitFor("network")

    cy.findByRole("figure", { name: "One" }).should("exist")
    cy.findByRole("presentation", { name: "One - 1" }).should("exist")
    cy.findByRole("presentation", { name: "One - 4" }).should("exist")

    cy.findByRole("figure", { name: "Two" }).should("exist")
    cy.findByRole("presentation", { name: "Two - 1" }).should("exist")
    cy.findByRole("presentation", { name: "Two - 4" }).should("exist")

    cy.findByRole("figure", { name: "Three" }).should("exist")
    cy.findByRole("presentation", { name: "Three - 1" }).should("exist")
    cy.findByRole("presentation", { name: "Three - 4" }).should("exist")
  })

  it("matches the snapshot.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create new chart" }).click()

    cy.waitFor("network")

    cy.percySnapshot()
  })
})
