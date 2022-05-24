const HtmlWebpackPlugin = require("html-webpack-plugin")
const { EnvironmentPlugin } = require("webpack")
const { config } = require("dotenv")

config({ path: "../../.env" })

const { NODE_ENV } = process.env

module.exports = {
  entry: "./src/index.tsx",
  mode: NODE_ENV !== "production" ? "development" : "production",
  devtool: "inline-source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
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
        use: ["ts-loader"].filter(Boolean),
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
