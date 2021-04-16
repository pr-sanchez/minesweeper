const { merge } = require("webpack-merge");
const common = require("./webpack.common");

/**@type {import('webpack').Configuration} */
const developmentConfiguration = {
  mode: "development",
  devServer: {
    port: 3000,
    contentBase: "../build",
    open: "chrome",
  },
};

module.exports = merge(common, developmentConfiguration);
