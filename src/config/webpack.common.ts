import * as webpack from "webpack";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import { PATH_SRC, PATH_PUBLIC } from "./paths";

export const commonConfig = {
  entry: `${PATH_SRC}/client/main.ts`,
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
        'fs': false,
        'path': false,
        'util': false
    }
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader'
    }, {
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      use: 'file-loader?name=assets/[name].[hash].[ext]'
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }]
  },
  plugins: [
    /*
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor']
    }),
    */
    new webpack.DefinePlugin({
      'process.env': {
        PORT: JSON.stringify(process.env.PORT),
        DEBUG: JSON.stringify(process.env.DEBUG),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        HOST: JSON.stringify(process.env.HOST)
      }
    }),
    new HtmlWebpackPlugin({
      template: `${PATH_PUBLIC}/template.html`,
      publicPath: process.env.NODE_ENV == "development" ? "" : "/game"
    })
  ]
}