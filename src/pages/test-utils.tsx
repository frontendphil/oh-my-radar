import { act } from "react-dom/test-utils"
import { render as baseRender } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { MockedProvider, MockedResponse } from "@apollo/client/testing"

const zeroTimeout = () => new Promise<void>((resolve) => setTimeout(resolve, 1))

export const finishMutations = async (...mutations: unknown[]) => {
  await act(async () => {
    for (const _ of mutations) {
      await zeroTimeout()
    }
  })
}

export const finishQueries = async (...queries: unknown[]) => {
  await act(async () => {
    for (const _ of queries) {
      await zeroTimeout()
    }
  })
}

type Component = Parameters<typeof baseRender>[0]
type Options = Parameters<typeof baseRender>[1] & {
  mocks?: MockedResponse[]
  path?: string
  route?: string
}

export const render = (
  component: Component,
  { mocks, path, route, ...options }: Options = {}
): ReturnType<typeof baseRender> => {
  return baseRender(
    <MemoryRouter initialEntries={route ? [{ pathname: route }] : undefined}>
      <MockedProvider mocks={mocks} addTypename={false}>
        {path ? (
          <Routes>
            <Route path={path} element={component} />
          </Routes>
        ) : (
          component
        )}
      </MockedProvider>
    </MemoryRouter>,
    options
  )
}

export type ItemType<T> = T extends (infer U)[] ? U : never
