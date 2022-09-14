import { PATH_BUILD } from "./paths";
import { commonConfig } from "./webpack.common";

const { merge } = require("webpack-merge")

export const devConfig = merge(commonConfig, {
  mode: "development",
  //devtool: 'cheap-module-eval-source-map',
  output: {
    path: PATH_BUILD,
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js'
  }
  //mode: "development",
  //devtool: "inline-source-map",
  //devtool: 'cheap-module-eval-source-map',
});
