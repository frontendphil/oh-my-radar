import { Children, PropsWithChildren, useId } from "react"

export const Tabs = ({ children }: PropsWithChildren) => {
  const id = useId()

  return (
    <div id={id} className="flex" role="tablist">
      {Children.map(children, (child) => (
        <div className="flex-1">{child}</div>
      ))}
    </div>
  )
}
