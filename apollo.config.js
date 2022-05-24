const dotenv = require("dotenv")

dotenv.config()

const { HASURA_ADMIN_SECRET, GRAPHQL_ENDPOINT } = process.env

module.exports = {
  client: {
    name: "oh-my-radar",
    tagName: "gql",
    includes: ["apps/website/**"],
    excludes: ["**/api.ts"],
    service: {
      name: "oh-my-radar",
      url: GRAPHQL_ENDPOINT,
      headers: {
        "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
      },
    },
  },
}
