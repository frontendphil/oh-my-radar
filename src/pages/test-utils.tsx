import { act } from "react-dom/test-utils"
import { render as baseRender } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { MockedProvider, MockedResponse } from "@apollo/client/testing"

const zeroTimeout = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

export const finishMutations = async (...mutations: unknown[]) => {
  await act(async () => {
    for (const _ of mutations) {
      await zeroTimeout()
    }
  })
}

type Component = Parameters<typeof baseRender>[0]
type Options = Parameters<typeof baseRender>[1] & {
  mocks?: MockedResponse[]
}

export const render = (
  component: Component,
  { mocks, ...options }: Options = {}
): ReturnType<typeof baseRender> => {
  return baseRender(
    <MemoryRouter>
      <MockedProvider mocks={mocks} addTypename={false}>
        {component}
      </MockedProvider>
    </MemoryRouter>,
    options
  )
}
