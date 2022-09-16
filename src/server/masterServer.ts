import { Game } from "../shared/game/Game"
import { isDevelopmentMode } from "../shared/utils"
import { WebServer } from "./WebServer"

export class MasterServer {
    public webServer: WebServer
    public game: Game

    constructor()
    {
        if (isDevelopmentMode())
        {
            console.log("\n################################")
            console.log("           DEVELOPMENT          ")
            console.log("################################\n")
        }

        this.webServer = new WebServer()
        this.game = new Game()
        this.game.start()
    }

    public start()
    {
        this.webServer.listen(parseInt(process.env.PORT))
    }
}