import * as BABYLON from "babylonjs"
import { Vector3 } from "babylonjs"
import { Entity } from "../Entity"

export class Ped extends Entity {
  public ini() {
    super.init()
  }

  public create() {
    super.create()

    const scene = this.scene

    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1})

    const m = BABYLON.MeshBuilder.CreatePlane("plane", {}, scene)
    this.mesh.addChild(m)
  }

  public update(dt: number) {
    super.update(dt)

    this.mesh.physicsImpostor.applyForce(new Vector3(0.1 * dt, 0, 0.1 * dt), new Vector3())
  }
}
