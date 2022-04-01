import invariant from "invariant"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { DevConfiguration } from "./DevConfiguration"

import "./main.css"

const container = document.getElementById("app")

invariant(container, 'Could not find app container with id "app".')

const root = createRoot(container)
root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/dev-configuration" element={<DevConfiguration />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
