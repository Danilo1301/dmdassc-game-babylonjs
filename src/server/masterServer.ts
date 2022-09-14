import * as express from "express";
import * as http from 'http'
import * as debug from "debug";
import { devConfig } from "../config/webpack.dev";
import { Game } from "../shared/game";
import { PATH_PUBLIC } from "../config/paths";

import * as socketio from 'socket.io';

const log = debug('app:server');

class User {
  public socket: socketio.Socket

  constructor(socket: socketio.Socket) {
    this.socket = socket
  }
}

class MasterServer {
  public express: express.Application;
  private server: http.Server;
  public io: socketio.Server;

  public users: User[] = []

  constructor() {
    console.log(`process.env.NODE_ENV=${process.env.NODE_ENV}`)

    this.express = express();
    this.server = http.createServer(this.express);

    this.io = new socketio.Server()
    this.io.attach(this.server, {cors: { origin: '*' }});
    this.io.on("connection", (socket: socketio.Socket) => {
      console.log('socket connection')
      const user = new User(socket)
      this.users.push(user)
    });

    this.middleware();

    //this.runCPUTest();

    const game = new Game(true);
    game.start();

    setInterval(() => {
      game.peds.forEach(ped => {
        const pedPos = ped.box.position
        const pedVel = ped.box.physicsImpostor.getLinearVelocity()
        
        this.users.forEach(user => {
          user.socket.emit("ped", {
            id: game.peds.indexOf(ped),
            x: parseFloat(pedPos.x.toFixed(2)),
            y: parseFloat(pedPos.y.toFixed(2)),
            z: parseFloat(pedPos.z.toFixed(2)),

            vx: parseFloat(pedVel.x.toFixed(2)),
            vy: parseFloat(pedVel.y.toFixed(2)),
            vz: parseFloat(pedVel.z.toFixed(2)),
          })
        })
      })
    }, 200);
  }

  public listen(port: number) {
    this.express.use('/', express.static(PATH_PUBLIC));

    console.log(PATH_PUBLIC)

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

export default MasterServer;
