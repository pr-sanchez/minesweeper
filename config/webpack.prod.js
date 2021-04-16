const { merge } = require("webpack-merge");
const common = require("./webpack.common");

/**@type {import('webpack').Configuration} */
const productionConfiguration = {
  mode: "production",
};

module.exports = merge(common, productionConfiguration);
