import { render } from "react-dom"

import "./main.css"

import { RadarChart } from "./RadarChart"

render(
  <RadarChart
    title="Test"
    dimensions={["One", "Two", "Three"]}
    range={[0, 4]}
  />,
  document.getElementById("app")
)
