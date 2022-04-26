const dotenv = require("dotenv")

dotenv.config()

const { HASURA_ADMIN_SECRET } = process.env

module.exports = {
  client: {
    name: "oh-my-radar",
    tagName: "gql",
    localSchemaFile: "schema.graphql",
    excludes: ["**/api.ts"],
    service: {
      name: "oh-my-radar",
      url: "https://graphql-dev.oh-my-radar.com/v1/graphql",
      headers: {
        "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
      },
    },
  },
}
