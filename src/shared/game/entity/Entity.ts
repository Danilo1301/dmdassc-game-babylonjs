import * as BABYLON from "babylonjs"
import { Mesh, MeshBuilder, TransformNode } from "babylonjs"
import { Component } from "../component/Component"
import { EntityManager } from "./EntityManager"

export class Entity {
    public readonly id: number
    public entityManager: EntityManager
    public mesh?: Mesh
    private _components: Component[] = []
    private _hasInit: boolean = false
    private _hasCreated: boolean = false
    private _hasDestroyed: boolean = false

    constructor(id: number, entityManager: EntityManager)
    {
        this.id = id
        this.entityManager = entityManager

        this.initEntity()
    }

    public get scene() { return this.entityManager.game.scene }

    public get position() { return this.mesh?.position }

    public addComponent<C extends Component>(c: C)
    {
        c.entity = this
        this._components.push(c)
        this._components = this._components.sort((a, b) => b.priority - a.priority)

        if(this._hasInit) c.init()
        if(this._hasCreated) c.create()

        return c
    }

    public getComponent<C extends Component>(constr: { new(...args: any[]): C }): C | undefined
    {
        for (const component of this._components) if (component instanceof constr) return component as C
        return undefined
    }

    public initEntity()
    {

    }

    public init()
    {
        console.log(`[${this.constructor.name}]`, `init`)

        this._hasInit = true
        for (const component of this._components) component.init()
    }
    
    public create()
    {
        console.log(`[${this.constructor.name}]`, `create`)

        this._hasCreated = true
        for (const component of this._components) component.create()
    }

    public update(dt: number)
    {
        for (const component of this._components) component.update(dt)
    }

    public destroy()
    {
        console.log(`[${this.constructor.name}]`, `destroy`)

        this._hasDestroyed = true
        for (const component of this._components) component.destroy()
    }
}
