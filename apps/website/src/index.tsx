import { ApolloClient, ApolloProvider } from "@apollo/client"
import invariant from "invariant"
import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Admin, Create, Participate, Results } from "./pages"

import "@radar/chart/chart.css"
import "./main.css"
import { createCache } from "./cache"

const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET

invariant(
  HASURA_ADMIN_SECRET,
  "HASURA_ADMIN_SECRET environment variable missing"
)

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT

invariant(GRAPHQL_ENDPOINT, "GRAPHQL_ENDPOINT environment variable missing")

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: createCache(),
  headers: {
    "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
  },
})

const container = document.getElementById("app")

invariant(container, 'Could not find app container with id "app".')

const root = createRoot(container)
root.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route
            index
            element={
              <Suspense>
                <Create />
              </Suspense>
            }
          />
          <Route
            path="/admin/:id"
            element={
              <Suspense>
                <Admin />
              </Suspense>
            }
          />
          <Route
            path="/participate/:id"
            element={
              <Suspense>
                <Participate />
              </Suspense>
            }
          />
          <Route
            path="/results/:id"
            element={
              <Suspense>
                <Results />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)
