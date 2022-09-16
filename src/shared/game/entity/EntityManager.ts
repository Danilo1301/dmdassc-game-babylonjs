import * as BABYLON from "babylonjs"
import { Game } from "../Game"
import { Ped } from "./entities/Ped"
import { Vehicle } from "./entities/Vehicle"
import { Entity } from "./Entity"

export class EntityManager {
    public uniqueEntityId: number = 0
    public game: Game
    public get scene() { return this.game.scene }
    private entities: Array<Entity> = []

    constructor(game: Game)
    {
        this.game = game
    }

    public update(dt: number)
    {
        this.entities.forEach(entity =>
        {
            entity.update(dt)
        })
    }

    public createEntity<TEntity extends Entity>(constr: { new(...args: any[]): TEntity })
    {
        console.log(`[EntityManager]`, `createEntity`)

        const entity = new constr(this.uniqueEntityId++, this)
        entity.init()
        this.addEntity(entity)
        return entity
    }

    public addEntity(entity: Entity)
    {
        console.log(`[EntityManager]`, `addEntity`)

        this.entities.push(entity)
        entity.create()
        return entity
    }

    public createPed()
    {
        console.log(`[EntityManager]`, `createPed`)

        return this.createEntity(Ped)
    }

    public createVehicle()
    {
        console.log(`[EntityManager]`, `createVehicle`)

        return this.createEntity(Vehicle)
    }

    public getEntities()
    {
        return this.entities
    }

    /*
    public create(components: Array<IComponent> = []): Entity {
        console.log(`[EntityManager]`, `create`);

        const entity = new Entity(this.entities.length, this);
        this.entities.push(entity);
        components.forEach(component => this.addComponent(entity.id, component));;
        return entity;
    }
    */
}
