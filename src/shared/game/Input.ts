import * as BABYLON from "babylonjs"

export class Input {
    private static keys: {[key: number]: boolean} = {}

    public static init(scene: BABYLON.Scene) {
        scene.onKeyboardObservable.add((kbInfo) => {
            switch (kbInfo.type) {
              case BABYLON.KeyboardEventTypes.KEYDOWN:
                console.log(`[Input]`, `KEY DOWN:`, kbInfo.event.inputIndex)
                this.keys[kbInfo.event.inputIndex] = true
                break;
              case BABYLON.KeyboardEventTypes.KEYUP:
                console.log(`[Input]`, `KEY UP:`, kbInfo.event.inputIndex);
                this.keys[kbInfo.event.inputIndex] = false
                break;
            }
        });
    }

    public static getHorizontal() {
        const KEY_LEFT = 65;
        const KEY_RIGHT = 68;
        return (Input.getKeyDown(KEY_RIGHT) ? 1 : 0) + ((Input.getKeyDown(KEY_LEFT) ? -1 : 0));
    }

    public static getVertical() {
        const KEY_UP = 87;
        const KEY_DOWN = 83;
        return (Input.getKeyDown(KEY_DOWN) ? 1 : 0) + ((Input.getKeyDown(KEY_UP) ? -1 : 0));
    }

    public static getKeyDown(key: number | string) {
        const keyCodes: number[] = []

        if(typeof key == 'string') {
            keyCodes.push(key.toLowerCase().charCodeAt(0))
            keyCodes.push(key.toUpperCase().charCodeAt(0))
        } else {
            keyCodes.push(key)
        }

        for (const keyCode of keyCodes) {
            const state = this.keys[keyCode] === true;
            if(state) return true;
        }

        return false;
    }
}