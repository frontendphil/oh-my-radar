const HtmlWebpackPlugin = require("html-webpack-plugin")
const { EnvironmentPlugin } = require("webpack")
const { config } = require("dotenv")

config()

const { NODE_ENV, COVERAGE } = process.env

module.exports = {
  entry: "./src/index.tsx",
  mode: NODE_ENV !== "production" ? "development" : "production",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  devServer: {
    historyApiFallback: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          COVERAGE && "@jsdevtools/coverage-istanbul-loader",
          "ts-loader",
        ].filter(Boolean),
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      publicPath: "/",
    }),
    new EnvironmentPlugin("HASURA_ADMIN_SECRET", "GRAPHQL_ENDPOINT"),
  ],
}
