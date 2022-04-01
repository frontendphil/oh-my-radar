const HtmlWebpackPlugin = require("html-webpack-plugin")

const { NODE_ENV } = process.env

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
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
}
