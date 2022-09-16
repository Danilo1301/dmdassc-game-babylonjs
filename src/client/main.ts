import "../config/environment"
import { Gameface } from "./Gameface"
//import "./style.css"

window.addEventListener('DOMContentLoaded', () => {
    const canvas = <HTMLCanvasElement>document.getElementById('view')
    const gameface = new Gameface(canvas)
    gameface.start()
    window["gameface"] = gameface
})