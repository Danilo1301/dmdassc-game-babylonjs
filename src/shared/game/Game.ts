import * as BABYLON from "babylonjs"
import * as Ammo from 'ammo.js';
import { Mesh, Vector3 } from "babylonjs"
import { EntityManager } from "./entity/EntityManager"
import { Constants } from "../../config/constants";
import { InputHandler } from "./component/InputHandler";

export class Game {
    public readonly headless
    public engine: BABYLON.Engine
    public scene: BABYLON.Scene
    public camera: BABYLON.ArcRotateCamera
    public ammo: any
    private canvas: HTMLCanvasElement
    private entityManager: EntityManager

    constructor(canvas?: HTMLCanvasElement)
    {
        console.log(`[Game]`, `Game()`, canvas)

        this.headless = canvas === undefined
        this.canvas = canvas
        this.engine = canvas ? new BABYLON.Engine(canvas, true) : new BABYLON.NullEngine()
        this.scene = new BABYLON.Scene(this.engine)
        this.entityManager = new EntityManager(this)
    }

    public async start()
    {
        console.log(`[Game]`, `start`)

        await this.loadAmmo()
        this.startGameloop()
        this.createAmbientScene()

        if(Constants.Client.SHOW_IMPOSTORS)
        {
            const physicsViewer = new BABYLON.Debug.PhysicsViewer()
            setInterval(() =>
            {
                this.scene.meshes.forEach(m =>
                {
                    if(m.physicsImpostor) physicsViewer.showImpostor(m.physicsImpostor, <Mesh>m)
                })
            }, 200)
        }
        
        this.createEnities()
    }

    public loadAmmo()
    {
        console.log(`[Game]`, `loadAmmo`)
        
        const game = this;
        return new Promise<void>(resolve =>
            {
                Ammo().then((ammo) =>
                {
                    game.ammo = ammo
                    game.scene.enablePhysics(new Vector3(0, -1, 0), new BABYLON.AmmoJSPlugin(false, ammo))
                    resolve()
                })
            }
        )
    }

    public startGameloop()
    {
        console.log(`[Game]`, `startGameloop`)

        let self = this
        let lastUpdate = Date.now()
        let myInterval = setInterval(tick, 1)

        function tick()
        {
            let now = Date.now()
            let dt = now - lastUpdate
            lastUpdate = now
            if(dt == 0) dt = 0.01
            self.update(dt)
        }
    }

    private createAmbientScene()
    {
        this.scene.ambientColor = new BABYLON.Color3(1, 1, 1)

        this.camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 3.2, 2, Vector3.Zero(), this.scene)
        this.camera.attachControl(this.canvas)

        const light = new BABYLON.HemisphericLight("light", new Vector3(0, 1, 0), this.scene)
        light.intensity = 0.6
    }
    
    private createEnities()
    {
        const scene = this.scene

        var grassTexture = new BABYLON.Texture("assets/grass.png", scene)
        grassTexture.uScale = 10
        grassTexture.vScale = 10

        var grassMaterial = new BABYLON.StandardMaterial("grassMaterial", scene)
        grassMaterial.diffuseTexture = grassTexture
        grassMaterial.specularColor = BABYLON.Color3.Black()

        const ground = BABYLON.MeshBuilder.CreateBox("ground", {width: 60, height: 0.1, depth: 60}, scene)
        ground.position.set(0, 0, 0)
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0})
        ground.physicsImpostor.friction = 0.5
        ground.material = grassMaterial


        var wallMaterial = new BABYLON.StandardMaterial("mat", scene)
        wallMaterial.diffuseTexture = new BABYLON.Texture("assets/wall.png", scene)

        const building = BABYLON.MeshBuilder.CreateBox("building", {width: 10, height: 5, depth: 4}, scene)
        building.position.set(10, 2.5, 0)
        building.physicsImpostor = new BABYLON.PhysicsImpostor(building, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0})
        building.material = wallMaterial

        const ramp = BABYLON.MeshBuilder.CreateBox("ramp", {width: 3, height: 2, depth: 13}, scene)
        ramp.position.set(6.5, 1.8, 7.5)
        ramp.rotation.set(35, 0, 0)
        ramp.physicsImpostor = new BABYLON.PhysicsImpostor(ramp, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0})
        ramp.material = wallMaterial


        const myVeh = this.entityManager.createVehicle()
        myVeh.lightsOn = true
        myVeh.getComponent(InputHandler).enabled = true

        this.entityManager.createVehicle()
    }

    public update(dt: number)
    {
        this.scene.render()
        this.entityManager.update(dt)
        this.updateCamera()
    }

    private updateCamera()
    {
        const follow = this.entityManager.getEntities()[0]
        const pos = follow.mesh!.position
        this.camera.setPosition(new Vector3(pos.x, pos.y + 20, pos.z))
        this.camera.target = pos
    }
}