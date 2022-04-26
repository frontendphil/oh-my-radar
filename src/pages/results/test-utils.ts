import { v4 } from "uuid"
import { Colors } from "../../radar-chart"
import { ItemType } from "../test-utils"
import { ResultGetChartQuery } from "./api"

type Chart = Omit<
  NonNullable<ResultGetChartQuery["charts_by_pk"]>,
  "__typename"
>

export const createChart = (
  chart: Partial<Chart> = {}
): NonNullable<ResultGetChartQuery["charts_by_pk"]> => ({
  title: "Test chart",
  min: 1,
  max: 4,
  dimensions: [],
  participants: [],
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

type Participant = Omit<ItemType<Chart["participants"]>, "__typename">

export const createParticipant = (
  participant: Partial<Participant> = {}
): ItemType<Chart["participants"]> => ({
  name: "John Doe",
  color: Colors.blue,

  selections: [],

  ...participant,

  id: v4(),
})

type Selection = Omit<ItemType<Participant["selections"]>, "__typename">

export const createSelection = (
  selection: Partial<Selection>
): ItemType<Participant["selections"]> => ({
  dimensionId: v4(),
  value: -1,

  ...selection,
})
