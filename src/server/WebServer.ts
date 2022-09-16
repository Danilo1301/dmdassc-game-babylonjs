import * as express from "express"
import * as http from 'http'
import * as socketio from 'socket.io'
import { Constants } from "../config/constants"
import { PATH_PUBLIC } from "../config/paths"
import { devConfig } from "../config/webpack.dev"
import { isDevelopmentMode } from "../shared/utils"

export class WebServer {
    public express: express.Application
    public io: socketio.Server;
    private server: http.Server

    constructor()
    {
        this.express = express()
        this.express.use('/', express.static(PATH_PUBLIC))
        this.server = http.createServer(this.express)

        this.io = new socketio.Server()
        this.io.attach(this.server, {cors: { origin: '*' }})

        if(Constants.Server.CREATE_EXPRESS_MIDDLEWARE)
        {
            this.middleware()
        }
    }

    public listen(port: number)
    {
        this.server.listen(port, () =>
        {
            console.log(`listening at http://localhost:${port}`)
        })
    }

    private middleware()
    {
        console.log(`[WebServer]`, `creating middleware (${process.env.NODE_ENV})`)

        if (isDevelopmentMode())
        {
            const webpack = require('webpack')
            const compiler = webpack(devConfig)

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
            }))
            //this.express.use('/assets', express.static('src/client/assets'))
        }
        else
        {
            this.express.use('/', express.static('public/game'))
        }
    }
}