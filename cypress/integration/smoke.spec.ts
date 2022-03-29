describe("Smoke test", () => {
  it("shows the application", () => {
    cy.visit("/")

    cy.findByRole("figure", { name: "Test" }).should("exist")
  })
})
