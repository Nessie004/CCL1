import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";


class WallObject extends BaseGameObject {
    blockGravityForces = true;

    reactToCollision = function (collidingObject)   {
        if (collidingObject.name == "Hippo") {
            collidingObject.x = collidingObject.previousX;
            collidingObject.y = collidingObject.previousY;
        }
    }

    constructor (x, y, width, height) {
        super(x, y, width, height);
        this.loadImages(["./images/big_block.png"]);
    }
}



export {WallObject};