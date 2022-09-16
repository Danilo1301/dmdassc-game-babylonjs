import { Entity } from "../entity/Entity"

export class Component {
    public entity: Entity
    public priority: number = 0

    public init()
    {
        console.log(`[${this.constructor.name}] init`);
    }

    public create()
    {
        console.log(`[${this.constructor.name}] init`);
    }

    public update(dt: number)
    {
        
    }

    public destroy()
    {
        console.log(`[${this.constructor.name}] destroy`);
    }
}