import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";


class Tree extends BaseGameObject {
    blockGravityForces = true;

    getBoxBounds = function () {
        let bounds = {
            left: this.x + 0,
            right: this.x + this.width - 0,
            top: this.y + 0,
            bottom: this.y + this.height - 0
        }
        return bounds;
    }

    constructor (x, y, width, height) {
        super(x, y, width, height);
        this.loadImages(["./images/tree.png"]);
    }
}



export {Tree};