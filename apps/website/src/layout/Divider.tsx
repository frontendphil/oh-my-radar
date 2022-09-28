type Props = {
  size?: "normal" | "tighter"
}

const sizes = {
  normal: "my-12",
  tighter: "my-6",
}

export const Divider = ({ size = "normal" }: Props) => (
  <hr className={`${sizes[size]} border-zinc-300 dark:border-zinc-500`} />
)
