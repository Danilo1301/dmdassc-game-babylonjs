import "../config/environment"
//import "./style.css"

import { Game, Ped } from "../shared/game"

import { io, Socket } from "socket.io-client";
import { Vector2, Vector3 } from "babylonjs";


window.addEventListener('DOMContentLoaded', () =>
{
  const socket: Socket = io(`${location.protocol}//${location.host}`, {
      //path: '/socket',
      //autoConnect: false,
      reconnection: false
  });

  socket.on("connect", () => {
    console.log("conn")
  })

  

  const game = new Game();
  game.start()

  window["game"] = this

  socket.on("ped", (data) => {
    //console.log(data)

    if(game.peds.length < data.id) {
      const ped: Ped = game.addPed(Ped, new Vector3(data.x, data.y, data.z))

      ped.networked = true;
    }

    if(game.peds[data.id]) {
      const ped = game.peds[data.id]

      ped.setPosition( new Vector3(data.x, data.y, data.z))
      ped.box.physicsImpostor.setLinearVelocity( new Vector3(data.vx*0.25, data.vy*0.25, data.vz*0.25))
    }
  })
})
