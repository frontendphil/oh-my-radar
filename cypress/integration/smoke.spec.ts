describe("Smoke test", () => {
  it("shows the application", () => {
    cy.visit("/")

    cy.percySnapshot()
  })

  it.skip("renders selections correctly.", () => {
    cy.visit("/dev-configuration")

    cy.findByRole("radio", { name: "One - 1" }).click()
    cy.findByRole("radio", { name: "Two - 2" }).click()
    cy.findByRole("radio", { name: "Three - 3" }).click()

    cy.findByRole("figure", { name: "john" }).should("exist")

    cy.percySnapshot()
  })

  it.skip("renders multiple selection correctly.", () => {
    cy.visit("/dev-configuration")

    cy.findByRole("radio", { name: "One - 1" }).click()
    cy.findByRole("radio", { name: "Two - 2" }).click()
    cy.findByRole("radio", { name: "Three - 3" }).click()

    cy.findByRole("figure", { name: "john" }).should("exist")

    cy.findByRole("textbox", { name: "Add a selection" }).type("jane{enter}")
    cy.findByRole("button", { name: 'Activate "jane"' }).click()

    cy.findByRole("radio", { name: "One - 3" }).click()
    cy.findByRole("radio", { name: "Two - 1" }).click()
    cy.findByRole("radio", { name: "Three - 2" }).click()

    cy.findByRole("figure", { name: "jane" }).should("exist")

    cy.percySnapshot()
  })
})
