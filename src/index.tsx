import { render } from "react-dom"

import "./main.css"

import { RadarChart } from "./RadarChart"

render(
  <RadarChart
    title="Test"
    dimensions={["One", "Two", "Three"]}
    scale={[0, 1, 2, 3, 4]}
  />,
  document.getElementById("app")
)
