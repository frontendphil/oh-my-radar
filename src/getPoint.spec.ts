import { getPoint } from "./getPoint"
import { Range } from "./types"

describe("getPoint", () => {
  const diagramWidth = 100
  const range: Range = [0, 1]

  it("resolves points in the first quadrant.", () => {
    const point = getPoint({ diagramWidth, range, value: 1, angle: 45 })

    expect(point).toEqual({ x: 35.36, y: 35.36 })
  })
})
