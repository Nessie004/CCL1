import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

class MoveTrigger extends BaseGameObject {
    backGroundDiv = null;

    update = function () {
        this.backGroundDiv.style.backgroundPositionX = global.backgroundShift + "px";
        global.canvas.style.marginLeft =  global.backgroundShift  + "px";
    }

    draw = function () {
       //global.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    resetViewpoint = function() {
        this.backGroundDiv.style.backgroundPositionX = 0;
        global.canvas.style.marginLeft =  0;
        global.backgroundShift = 0;
    }

    reactToCollision = function (collidingObject)   {
        if (collidingObject.name == "Hippo") {
            let shiftBy = collidingObject.xVelocity * global.deltaTime;
            global.backgroundShift += shiftBy * -1;

            if (global.backgroundShift < global.backgroundMaxShift) {
                global.backgroundShift = global.backgroundMaxShift;
                collidingObject.x = collidingObject.previousX;
            }
            else if (global.backgroundShift > 0) {
                global.backgroundShift = 0;
                collidingObject.x = collidingObject.previousX;
            }
            else {
                global.leftMoveTrigger.x += shiftBy;
                global.rightMoveTrigger.x += shiftBy;
            }
        }

    }

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.backGroundDiv = document.querySelector("#background");
    }
}

export {MoveTrigger}