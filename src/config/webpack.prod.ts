import { NoEmitOnErrorsPlugin } from "webpack"
//import * as CopyWebpackPlugin from "copy-webpack-plugin"
import { commonConfig } from "./webpack.common"
import { PATH_BUILD } from "./paths"

import { merge } from "webpack-merge"
import { CleanWebpackPlugin } from "clean-webpack-plugin"

import * as dotenv from "dotenv"

dotenv.config();

export default merge<any>(commonConfig, {
  mode: "production",
  //devtool: 'source-map',
  output: {
    path: PATH_BUILD,
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new CleanWebpackPlugin(),
    //new optimize.UglifyJsPlugin(),
    //new CopyWebpackPlugin({patterns: [{from: ASSETS, to: `${DIST}/assets`}]})
  ]
})
