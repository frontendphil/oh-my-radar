import { useState } from "react"
import { v4 } from "uuid"

export const useId = (): string => {
  const [id] = useState(v4)

  return id
}
