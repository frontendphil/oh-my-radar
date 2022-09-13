import { PropsWithChildren, ReactNode } from "react"

type Props = PropsWithChildren<{
  id?: string
}>

export const Hint = ({ id, children }: Props) => (
  <div id={id} className="flex justify-center p-12 italic opacity-50">
    {children}
  </div>
)
