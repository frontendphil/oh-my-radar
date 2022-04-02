import { useState } from "react"
import { Button } from "./form-controls"

export const Create = () => {
  const [loading, setLoading] = useState(false)

  return (
    <Button onClick={() => setLoading(true)}>
      {loading ? "Creating your chart..." : "Create new chart"}
    </Button>
  )
}
