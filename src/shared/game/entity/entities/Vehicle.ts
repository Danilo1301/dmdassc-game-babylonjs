import * as BABYLON from "babylonjs"
import { MeshBuilder, Vector2, Vector3 } from "babylonjs"
import { Input } from "../../Input"
import { Entity } from "../Entity"
import * as Ammo from 'ammo.js';
import { InputHandler } from "../../component/InputHandler";

export class Vehicle extends Entity {
  public lightsOn: boolean = false

  public initEntity()
  {
    super.initEntity()

    this.addComponent(new InputHandler({}))
  }

  public init()
  {
    super.init()
  }

  public create()
  {
    super.create()

    const scene = this.scene
    const size = new Vector2(1, 2)

    var mat = new BABYLON.StandardMaterial("mat", scene)
    mat.diffuseTexture = new BABYLON.Texture("assets/car1.png", scene)
    mat.specularColor = BABYLON.Color3.Black()

    this.mesh = BABYLON.MeshBuilder.CreateBox("veh", {width: size.x, height: 0.4, depth: size.y}, scene)
    this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 200})
    //this.mesh.physicsImpostor.physicsBody.setAngularFactor(new this.entityManager.game.ammo.btVector3(0, 1, 0))
    this.mesh.physicsImpostor.friction = 0.8;
    this.mesh.material = mat
    this.mesh.position.set(Math.random() * -10, 2, 0)

    this.setupPoliceLights()
  }

  public update(dt: number) {
    super.update(dt)

    this.updateMovement()
  }

  private setupPoliceLights()
  {
    var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 1, 0), this.scene);
    light.diffuse = BABYLON.Color3.Blue()
    light.intensity = 0
    light.parent = this.mesh
    light.range = 5
    setInterval(() =>
    {
        if(light.diffuse.equals(BABYLON.Color3.Blue())) {
            light.diffuse = BABYLON.Color3.Red()
        } else {
            light.diffuse = BABYLON.Color3.Blue()
        }
        
        light.intensity = this.lightsOn ? 2 : 0
        
    }, 300)
  }

  private updateMovement()
  {
    const inputHandler = this.getComponent(InputHandler)

    if(this.getComponent(InputHandler))

    if(!inputHandler) return
    if(!inputHandler.enabled) return

    const speed = 150
    const verticalInput = Input.getVertical()

    this.mesh.physicsImpostor.applyForce(
      new Vector3(
        this.mesh.forward.x * speed * verticalInput,
        0,
        this.mesh.forward.z * speed * verticalInput
      ), 
      this.mesh.position
    )

    const horizontalInput = Input.getHorizontal()
    const turningSpeed = 0.5

    //const angVel = this.mesh.physicsImpostor.getAngularVelocity()
    this.mesh.physicsImpostor.setAngularVelocity(new Vector3(0, horizontalInput * turningSpeed, 0))
  }
}
