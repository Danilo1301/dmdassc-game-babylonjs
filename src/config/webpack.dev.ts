const path = require("path")
const { merge } = require("webpack-merge")
import { commonConfig } from "./webpack.common";

import {DIST} from "./paths";

export const devConfig = merge(commonConfig, {
  mode: "development",

  //devtool: 'cheap-module-eval-source-map',

  output: {
    path: DIST,
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js'
  }

  //mode: "development",
  //devtool: "inline-source-map",
  
  //devtool: 'cheap-module-eval-source-map',


  /*
  output: {
    path: DIST,
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js'
  }
  */
  
  

});
