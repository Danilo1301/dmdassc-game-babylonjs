import * as BABYLON from "babylonjs";
import * as debug from "debug";

import {BabylonFileLoaderConfiguration, Camera, Engine} from "babylonjs";
import {Scene} from "babylonjs";
import {ArcRotateCamera} from "babylonjs";
import {Vector3} from "babylonjs";
import {HemisphericLight} from "babylonjs";
import {MeshBuilder} from "babylonjs";

import 'babylonjs-loaders';

import * as Ammo from 'ammo.js';

const log = debug('app:game');

class Player {
    public box: BABYLON.Mesh

    constructor(scene: Scene) {
        let box = this.box = MeshBuilder.CreateBox("box", {}, scene);
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1});

        setInterval(() => {
            box.physicsImpostor.applyForce(new Vector3(2, 0, 0), new Vector3(0, 0, 0))

            if(box.position.y < 0) {
                box.position.set(0, 5, 0)
                box.physicsImpostor.setLinearVelocity(new Vector3())
                box.physicsImpostor.setAngularVelocity(new Vector3())
            }
        }, 500)
    }

    public setPosition(pos: Vector3) {
        this.box.position.set(pos.x, pos.y, pos.z);
    }
}

export class Game {
    public headless: boolean = false
    public scene: Scene;
    public camera: Camera;
    public physicsViewer: BABYLON.PhysicsViewer;

    public buildingContainerPrefab: BABYLON.AssetContainer;

    constructor(headless: boolean = false) {
        this.headless = headless

        if(headless) {
            global.XMLHttpRequest = require('xhr2').XMLHttpRequest;
        }
    }
    
    public makePhysicsObject(obj, scene, scaling){
        //const game = this;
        //const collisionTag = "Collision";
        
        obj.physicsImpostor = new BABYLON.PhysicsImpostor(obj, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0 }, scene);

        /*
        
        
        // Create physics root and position it to be the center of mass for the imported mesh
        var physicsRoot = new BABYLON.Mesh("physicsRoot", scene);
        //physicsRoot.position.y -= 0.9;

        // For all children labeled box (representing colliders), make them invisible and add them as a child of the root object
        newMeshes.forEach((m, i)=>{
            if(m.name.indexOf(collisionTag) != -1){
                //m.isVisible = false
                physicsRoot.addChild(m)
            }
        })

        // Add all root nodes within the loaded gltf to the physics root
        newMeshes.forEach((m, i)=>{
            if(m.parent == null){
                physicsRoot.addChild(m)
            }
        })

        // Make every collider into a physics impostor
        physicsRoot.getChildMeshes(false).forEach((m)=>{
            if(m.name.indexOf(collisionTag) != -1){
                //m.scaling.x = Math.abs(m.scaling.x)
                //m.scaling.y = Math.abs(m.scaling.y)
                //m.scaling.z = Math.abs(m.scaling.z)

                //console.log(m)

                m.physicsImpostor = new BABYLON.PhysicsImpostor(m, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0.1 }, scene);
            }
        })
        
        // Scale the root object and turn it into a physics impsotor
        //physicsRoot.scaling.scaleInPlace(scaling)
        physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.NoImpostor, { mass: 0 }, scene);
        
        return physicsRoot
        */
    }

    public createChunk(x: number, y: number, z: number) {
        const instance = this.buildingContainerPrefab.instantiateModelsToScene()
        instance.rootNodes[0].position.set(x, y, z)
        this.makePhysicsObject(instance.rootNodes[0], this.scene, 1)

        for (let i = 0; i < 3; i++) {
            const npc = new Player(this.scene)
            npc.setPosition(new Vector3(x, y + 10, z))
        }

        const ground = MeshBuilder.CreateGround("ground", {width: 30, height: 30}, this.scene)
        ground.position.set(x, y, z)
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});

    }

    public async start() {
        console.log("start")

        await this.initScene()
        await new Promise<void>(resolve => {
            const game = this;
            BABYLON.SceneLoader.LoadAssetContainerAsync("http://localhost:3000/", "building1.glb", game.scene, null, ".glb").then(container => {
                game.buildingContainerPrefab = container
                resolve()
            })
        })

        for (let ix = 0; ix < 4; ix++) {
            for (let iy = 0; iy < 4; iy++) {
                this.createChunk(ix * 30, 0, iy * 30)
            }
        }

        console.log("all done")
        //this.scene.getPhysicsEngine().getImpostors().forEach(i => this.physicsViewer.showImpostor(i) );
    }

    private async initScene() {
        return new Promise<void>(resolve => {
            Ammo().then((ammo) => {
                const view = this.headless ? undefined : document.getElementById("view") as HTMLCanvasElement
                const engine = view ? new Engine(view, true) : new BABYLON.NullEngine();
                const scene = this.scene = new Scene(engine)
                scene.enablePhysics(new Vector3(0, -5, 0), new BABYLON.AmmoJSPlugin(true, ammo))
                scene.getPhysicsEngine().setTimeStep(1/150);
    
                const camera = this.camera = new ArcRotateCamera(
                    "camera",
                    Math.PI / 2,
                    Math.PI / 3.2,
                    2,
                    Vector3.Zero(),
                    scene
                )
                camera.attachControl(view)
                
                const light = new HemisphericLight(
                    "light",
                    new Vector3(0, 1, 0),
                    scene
                )
                
                if(!this.headless){
                    engine.runRenderLoop(() => {
                        scene.render()
                    })
                    scene.debugLayer.show()
                }

                this.physicsViewer = new BABYLON.Debug.PhysicsViewer(scene);

                resolve()
            })
        })
    }

}