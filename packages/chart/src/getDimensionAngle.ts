export const getDimensionAngle = (
  dimensions: unknown[],
  index: number
): number => {
  const angle = 360 / dimensions.length
  const angleOffset = angle / 2

  return -90 + angleOffset + angle * index
}
