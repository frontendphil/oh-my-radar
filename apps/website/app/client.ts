import { Client } from "@urql/core"
import invariant from "invariant"

const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET

invariant(
  HASURA_ADMIN_SECRET,
  "HASURA_ADMIN_SECRET environment variable missing"
)

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT

invariant(GRAPHQL_ENDPOINT, "GRAPHQL_ENDPOINT environment variable missing")

export const client = new Client({
  url: GRAPHQL_ENDPOINT,
  fetchOptions: {
    headers: {
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
  },
})
