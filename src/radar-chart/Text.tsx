import { useLayoutEffect, useRef, useState } from "react"

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
  children: string
  x: number
  y: number
}

export const Text = ({ children, x, y }: TextProps) => {
  const ref = useRef<HTMLSpanElement | null>(null)

  const [left, setLeft] = useState(0)
  const [top, setTop] = useState(0)

  useLayoutEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const { width, height } = node.getBoundingClientRect()
    const padding = 10

    const align = getAlign(x)
    const justify = getJustify(y)

    if (align === Align.left) {
      setLeft(padding)
    }

    if (align === Align.right) {
      setLeft(-(width + padding))
    }

    if (align === Align.center) {
      setLeft(-(width / 2))
    }

    if (justify === Justify.top) {
      setTop(padding)
    }

    if (justify === Justify.bottom) {
      setTop(-(height + padding))
    }

    if (justify === Justify.center) {
      setTop(-(height / 2))
    }
  }, [x, y])

  return (
    <div style={{ position: "absolute", top: y, left: x }}>
      <span className="relative" ref={ref} style={{ left, top }}>
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