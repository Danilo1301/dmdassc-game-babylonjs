import * as BABYLON from "babylonjs";
import {Engine} from "babylonjs";
import {Scene} from "babylonjs";
import {ArcRotateCamera} from "babylonjs";
import {Vector3} from "babylonjs";
import {HemisphericLight} from "babylonjs";
import {MeshBuilder} from "babylonjs";

import * as Ammo from 'ammo.js';

export class Game {

    constructor(headless: boolean = false) {
        Ammo().then((ammo) => {
            const view = headless ? undefined : document.getElementById("view") as HTMLCanvasElement

            const engine = view ? new Engine(view, true) : new BABYLON.NullEngine();
            const scene = new Scene(engine)
            scene.enablePhysics(new Vector3(0, -5, 0), new BABYLON.AmmoJSPlugin(true, ammo))
        
            const camera = new ArcRotateCamera(
                "camera",
                Math.PI / 2,
                Math.PI / 3.2,
                2,
                Vector3.Zero(),
                scene)
            
            camera.attachControl(view)
            
            const light = new HemisphericLight(
                "light",
                new Vector3(0, 1, 0),
                scene)
            
            //const material =  new SampleMaterial("material", scene)
            
            
            // grounds
            let ground1 = MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
            //ground1.material = material
            ground1.position.y = -3.1;
            ground1.position.x = 25;
            ground1.position.z = 25;
            ground1.rotation.z = 0.1;
            ground1.rotation.x = -0.1;
            
            let ground2 = MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
            ground2.position.y = -3.1;
            ground2.position.x = -25;
            ground2.position.z = 25;
            ground2.rotation.z = -0.1;
            ground2.rotation.x = -0.1;
            
            let ground3 = MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
            ground3.position.y = -3.1;
            ground3.position.x = 25;
            ground3.position.z = -25;
            ground3.rotation.z = 0.1;
            ground3.rotation.x = 0.1;
            
            let ground4 = MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);
            ground4.position.y = -3.1;
            ground4.position.x = -25;
            ground4.position.z = -25;
            ground4.rotation.z = -0.1;
            ground4.rotation.x = 0.1;

            //
            [ground1, ground2, ground3, ground4].forEach(ground => {
                ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
            });
        
            function rand() {
                let sign = Math.random() < 0.5;
                return Math.random() * (sign ? 1 : -1);
            }
            
            function ballPosition(ball) {
                ball.position.y = -2;
                ball.position.x = rand() * 20;
                ball.position.z = rand() * 20;
            }
            
            let ball = MeshBuilder.CreateSphere("ball", {diameter: 2, segments: 4}, scene);
            ballPosition(ball);
            let balls = [ball];
            
            for(let i = 0; i < 99; ++i) {
                let b = ball.clone("ball" + i);
                ballPosition(b)
                balls.push(b);
            }
            
            balls.forEach(ball => {
                ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 1});
            });
            //


            console.log(`${scene.meshes.length} meshes`)

            //

            engine.runRenderLoop(() => {
                scene.render();
            })
        });
    }


}