import invariant from "invariant"

describe("Participate", () => {
  it("is possible to participate in a chart.", () => {
    cy.visit("/")

    cy.findByRole("button", { name: "Create new chart" }).click()

    cy.waitFor("network")

    cy.findByRole("textbox", { name: "Participant view" })
      .invoke("val")
      .then((url) => {
        invariant(
          typeof url === "string",
          `${url} was supposed to be a "string".`
        )

        cy.location().then((location) => {
          const [, id] = location.pathname.split("/admin/")

          cy.visit(`${location.origin}/participate/${id}`)

          cy.waitFor("network")

          cy.percySnapshot()
        })
      })
  })
})
