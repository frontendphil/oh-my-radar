import { useEffect, useRef, useState } from "react"

const enum Align {
  left = "left",
  center = "center",
  right = "right",
}

const enum Justify {
  top = "top",
  center = "center",
  bottom = "bottom",
}

type TextProps = {
  id: string
  children: string
  x: number
  y: number
}

export const Text = ({ id, children, x, y }: TextProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const { width, height } = node.getBoundingClientRect()
    const paddingX = 10
    const paddingY = 5

    const align = getAlign(x)
    const justify = getJustify(y)

    if (align === Align.left) {
      setLeft(paddingX)
    }

    if (align === Align.right) {
      setLeft(-(width + paddingX))
    }

    if (align === Align.center) {
      setLeft(-(width / 2))
    }

    if (justify === Justify.top) {
      setTop(paddingY)
    }

    if (justify === Justify.bottom) {
      setTop(-(height + paddingY))
    }

    if (justify === Justify.center) {
      setTop(-(height / 2))
    }
  }, [x, y])

  return (
    <div
      id={id}
      ref={ref}
      style={{
        position: "absolute",
        top: y,
        left: x,
      }}
    >
      <span className="relative" style={{ left, top }}>
        {children}
      </span>
    </div>
  )
}

const getAlign = (x: number): Align => {
  if (x < 0) {
    return Align.right
  }

  if (x > 0) {
    return Align.left
  }

  return Align.center
}

const getJustify = (y: number): Justify => {
  if (y < 0) {
    return Justify.bottom
  }

  if (y > 0) {
    return Justify.top
  }

  return Justify.center
}
