import webpackCommon from './webpack.common'
import * as webpackMerge from 'webpack-merge';
import {CLIENT, DIST} from "./paths";

export default webpackMerge(webpackCommon, {

  entry: {
    'test': `${CLIENT}/EntityManager.spec.ts`
  },

});
