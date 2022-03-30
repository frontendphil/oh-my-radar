import { getLengthToSelection } from "./getLengthToSelection"
import { Range } from "./types"

describe("getLengthToSelection", () => {
  it("uses half of the diagram width for the max value.", () => {
    const diagramWidth = 100
    const range: Range = [0, 1]

    expect(getLengthToSelection(diagramWidth, range, 1)).toEqual(50)
  })

  it("uses a fraction of the total length for intermediate values.", () => {
    const diagramWidth = 100
    const range: Range = [1, 4]

    expect(getLengthToSelection(diagramWidth, range, 2)).toEqual(25)
  })
})
