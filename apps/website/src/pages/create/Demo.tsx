import { useEffect, useState } from "react"
import { Colors, RadarChart, Selection } from "@radar/chart"

export const Demo = () => {
  const john = useRandomSelection()
  const jane = useRandomSelection()

  return (
    <RadarChart
      title="Comparing Cars Across Dimensions"
      range={[1, 5]}
      dimensions={[
        { id: "acceleration", title: "Acceleration" },
        { id: "displacement", title: "Displacement" },
        { id: "horsepower", title: "Horsepower" },
        { id: "mpg", title: "MPG" },
        { id: "weight", title: "Weight" },
      ]}
    >
      <Selection name="Jane" value={jane} />
      <Selection name="John" color={Colors.green} value={john} />
    </RadarChart>
  )
}

const useRandomSelection = () => {
  const [selection, setSelection] = useState({})

  useEffect(() => {
    const randomizeSelection = () => {
      setSelection({
        acceleration: Math.floor(Math.random() * 5 + 1),
        displacement: Math.floor(Math.random() * 5 + 1),
        horsepower: Math.floor(Math.random() * 5 + 1),
        mpg: Math.floor(Math.random() * 5 + 1),
        weight: Math.floor(Math.random() * 5 + 1),
      })
    }

    randomizeSelection()

    const interval = setInterval(randomizeSelection, 5000)

    return () => clearInterval(interval)
  }, [])

  return selection
}
