import * as BABYLON from "babylonjs"
import { Mesh } from "babylonjs"
import { Constants } from "../config/constants"
import { Game } from "../shared/game/Game"
import { Input } from "../shared/game/Input"

export class Gameface {
    public game: Game

    constructor(canvas: HTMLCanvasElement)
    {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        
        this.game = new Game(canvas)
    }

    public async start()
    {
        Input.init(this.game.scene)

        await this.game.start()

        if(Constants.Client.SHOW_DEBUG_LAYER)
        {
            this.game.scene.debugLayer.show()
        }
    }
}