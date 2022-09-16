import { Entity } from "../entity/Entity"
import { Input } from "../Input"
import { Component } from "./Component"

export class InputHandler extends Component {
    public entity: Entity
    public priority: number = 0

    public enabled: boolean = false
    public horizontal: number = 0
    public vertical: number = 0

    constructor(properties: {enabled?: boolean})
    {
        super()

        this.enabled = properties.enabled || false
    }

    public init()
    {
        super.init()
    }
    
    public update(dt: number) {
        super.update(dt);

        if(this.enabled) {
            const KEY_LEFT = 65;
            const KEY_RIGHT = 68;
            const KEY_UP = 87;
            const KEY_DOWN = 83;

            this.horizontal = (Input.getKeyDown(KEY_RIGHT) ? 1 : 0) + ((Input.getKeyDown(KEY_LEFT) ? -1 : 0));
            this.vertical = (Input.getKeyDown(KEY_DOWN) ? 1 : 0) + ((Input.getKeyDown(KEY_UP) ? -1 : 0));
        }
    }

    public destroy()
    {
        super.destroy()
    }
}