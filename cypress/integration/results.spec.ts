import invariant from "invariant"

describe("Results", () => {
  it("is possible to see the results.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create new chart" }).click()

    cy.waitFor("network")

    cy.findByRole("textbox", { name: "Results view" })
      .invoke("val")
      .then((url) => {
        invariant(
          typeof url === "string",
          `${url} was supposed to be a "string".`
        )

        cy.location().then((location) => {
          cy.visit(url.replace("http://localhost", location.origin))

          cy.waitFor("network")

          cy.percySnapshot()
        })
      })
  })
})
