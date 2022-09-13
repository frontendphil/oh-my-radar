import { act } from "react-dom/test-utils"
import crypto from "crypto"
import { render as baseRender } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { MockedProvider, MockedResponse } from "@apollo/client/testing"
import { ReactNode } from "react"
import { InMemoryCache } from "@apollo/client"

const zeroTimeout = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 10))

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
  routes?: ReactNode
}

export const render = (
  component: Component,
  { mocks, path = "/", route = "/", routes, ...options }: Options = {}
): ReturnType<typeof baseRender> => {
  return baseRender(
    <MockedProvider mocks={mocks} cache={new InMemoryCache()}>
      <MemoryRouter initialEntries={[{ pathname: route }]}>
        <Routes>
          <Route path={path} element={component} />

          {routes}
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
    options
  )
}

export type ItemType<T> = T extends (infer U)[] ? U : never

export const uuid = () => crypto.randomUUID()
