import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import invariant from "invariant"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { DevConfiguration } from "./DevConfiguration"

import "./main.css"

const client = new ApolloClient({
  uri: "https://graphql-dev.oh-my-radar.com/v1/graphql",
  cache: new InMemoryCache(),
})

const container = document.getElementById("app")

invariant(container, 'Could not find app container with id "app".')

const root = createRoot(container)
root.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/dev-configuration" element={<DevConfiguration />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)
