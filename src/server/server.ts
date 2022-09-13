import * as express from "express";
import * as http from 'http'
import * as debug from "debug";
import { devConfig } from "../config/webpack.dev";
import { DIST, PUBLIC } from "../config/paths";
import { Game } from "../shared/game";

const log = debug('app:server');

class Server {

  public express: express.Application;
  private server: http.Server;

  constructor() {
    this.express = express();
    this.middleware();

    //this.runCPUTest();

    const game = new Game(true);
    game.start();
  }

  public listen(port: number) {
    this.server = http.createServer(this.express);

    this.express.use('/', express.static(PUBLIC));

    console.log(PUBLIC)

    this.server.listen(port, () => {
      log(`listening at http://localhost:${port}`);
    });

  }

  private middleware(): void {
    if (process.env.NODE_ENV === 'development') {
      const webpack = require('webpack');
      const compiler = webpack(devConfig);

      this.express.use(require('webpack-dev-middleware')(compiler, {
        /*
        quiet: false,
        noInfo: true,
        lazy: false,
        */
        stats: {
          colors: true,
          chunks: false,
          chunkModules: false
        },
        publicPath: compiler.options.output.publicPath
      }));

      //this.express.use('/assets', express.static('src/client/assets'));
    } else {
      //this.express.use('/', express.static(DIST));
    }
  }

  private runCPUTest() {
    const os = require('os-utils');
    setInterval(() => {
        os.cpuUsage(function(v) {
            console.log('[index] CPU Usage (%): ' + v)
        })
    }, 1000)
  }

}

export default Server;
