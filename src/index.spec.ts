describe("index", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("id", "app")

    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
  })

  it("does not crash", async () => {
    await expect(import("./index")).resolves.not.toThrow()
  })
})
