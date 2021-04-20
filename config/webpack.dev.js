const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

/** @type {import('webpack').Configuration} */
const developmentConfiguration = {
  mode: "development",
  devServer: {
    port: 3000,
    contentBase: "../build",
    open: "chrome",
    hot: true,
    historyApiFallback: true,
  },
  target: "web", // will ignore the default target that is the browserslist configuration, this is due to the dependency "webpack-dev-server" does not reloads the page when the code of a component changes, this will be fixed in the "webpack-dev-server" version 4
  plugins: [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        use: ["style-loader", "css-loader", "sass-loader"],
        test: /.(css|sass|scss)$/,
      },
    ],
  },
};

module.exports = merge(common, developmentConfiguration);
