import invariant from "invariant"

export const getText = (value: FormDataEntryValue | null): string => {
  invariant(typeof value === "string", "Value is not a string.")

  return value
}

export const getNumber = (value: FormDataEntryValue | null): number => {
  invariant(typeof value === "string", "Can only parse strings to numbers.")

  const number = parseInt(value, 10)

  invariant(!isNaN(number), "Number is NaN")

  return number
}
