import invariant from "invariant"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { DevConfiguration } from "./DevConfiguration"

import "./main.css"

const container = document.getElementById("app")

invariant(container, 'Could not find app container with id "app".')

const root = createRoot(container)
root.render(
  <StrictMode>
    <DevConfiguration />
  </StrictMode>
)
