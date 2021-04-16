const path = require("path");

/**@type {import('webpack').Configuration} */
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    name: "[name].[contenthash].js",
    publicPath: "",
  },
};
