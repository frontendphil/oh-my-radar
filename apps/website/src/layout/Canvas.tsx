import { PropsWithChildren, ReactNode } from "react"

type Props = PropsWithChildren<{
  title: string
}>

export const Canvas = ({ children, title }: Props) => (
  <div className="flex h-full w-full flex-col items-center justify-center bg-white dark:bg-zinc-900">
    <h1 className="mb-5 px-6 text-center text-2xl font-semibold md:mb-10">
      {title}
    </h1>
    {children}
  </div>
)
