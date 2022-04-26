import { v4 } from "uuid"
import { ItemType } from "../test-utils"
import { ParticipantGetChartQuery } from "./api"

type Chart = Omit<
  NonNullable<ParticipantGetChartQuery["charts_by_pk"]>,
  "__typename"
>

export const createChart = (
  chart: Partial<Chart> = {}
): NonNullable<ParticipantGetChartQuery["charts_by_pk"]> => ({
  title: "Test chart",
  min: 1,
  max: 4,
  dimensions: [],
  ...chart,
})

type Dimension = Omit<ItemType<Chart["dimensions"]>, "__typename">

export const createDimension = (
  dimension: Partial<Dimension> = {}
): ItemType<Chart["dimensions"]> => ({
  title: "Test dimension",

  ...dimension,

  id: v4(),
})
