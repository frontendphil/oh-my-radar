describe("Smoke test", () => {
  it("shows the application", () => {
    cy.visit("localhost:8082")

    cy.findByRole("figure", { name: "Test" }).should("exist")
  })
})
