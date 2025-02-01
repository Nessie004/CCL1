import { global } from "../modules/global.js";
import { BaseGameObject } from "./baseGameObject.js";

class Food extends BaseGameObject {
    name = "Food";

    animationData = {
        "animationSprites": [],
        "timePerSprite": 0.15,
        "currentSpriteElapsedTime": 0,
        "firstSpriteIndex": 0,
        "lastSpriteIndex": 0,
        "currentSpriteIndex": 0
    };

    

    getBoxBounds = function () {
        let bounds = {
            left: this.x + 80,
            right: this.x + this.width - 80,
            top: this.y + 50,
            bottom: this.y + this.height - 70
        }
        return bounds;
    };

    reactToCollision = function(collidingObject) {
        switch (collidingObject.name) {
            case "Hippo":
                this.active = false;
                global.foodCount--;
                break;
        }
    }
    

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.loadImagesFromSpritesheet("./images/food_spritesheet.png" ,9, 1);
        console.log ("Food is created");
        this.switchCurrentSprites(0, 8);
    }

}

export {Food}