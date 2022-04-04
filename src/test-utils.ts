import { act } from "react-dom/test-utils"

const zeroTimeout = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

export const finishMutations = async () => {
  await act(async () => await zeroTimeout())
}
