import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

class Bug extends BaseGameObject {
    name = "Bug";
    xVelocity = 50;
    yVelocity = 0;
    markForDeletion = false;
    maxMoveDistance = 100;
    startX = 0;
    startY = 680;
    movingRight = true;
    isDying = false;

    animationData = {
        "animationSprites": [],
        "timePerSprite": 0.14,
        "currentSpriteElapsedTime": 0,
        "firstSpriteIndex": 0,
        "lastSpriteIndex": 9,
        "currentSpriteIndex": 0,
        "dyingAnimation": {
            "firstSpriteIndex": 10,
            "lastSpriteIndex": 15,
            "timePerSprite": 0.30
        }
    };

    getBoxBounds = function () {
        let bounds = {
            left: this.x + 55,
            right: this.x + this.width - 55,
            top: this.y + 38,
            bottom: this.y + this.height - 37
        };
        return bounds;
    };

    update = function () {
        if (this.isDying) {
            this.playDyingAnimation();
            return; // Während der Sterbeanimation keine Bewegung mehr
        }

        if (this.movingRight) {
            this.x += this.xVelocity * global.deltaTime;
            if (this.x >= this.startX + this.maxMoveDistance) {
                this.movingRight = false; // Richtung umkehren
                this.switchCurrentSprites(0, 4);
            }
        } else {
            this.x -= this.xVelocity * global.deltaTime;
            if (this.x <= this.startX) {
                this.movingRight = true; // Richtung umkehren
                this.switchCurrentSprites(5, 9);
            }
        }

        // Der Bug bleibt auf der gleichen Y-Position (Bodenhöhe)
        this.y = this.startY;
    };

    reactToCollision = function (collidingObject) {
        const playerBounds = collidingObject.getBoxBounds();
        const bugBounds = this.getBoxBounds();

        const isPlayerAbove = playerBounds.bottom <= bugBounds.top + 10;
        const isHorizontalCollision =
            playerBounds.right > bugBounds.left &&
            playerBounds.left < bugBounds.right;

        console.log("Collision detected:");
        console.log("Player Bounds:", playerBounds);
        console.log("Bug Bounds:", bugBounds);

        if (isPlayerAbove && isHorizontalCollision) {
            console.log("Bug died :(");
            this.startDyingAnimation();
            collidingObject.yVelocity = -200; // Spieler wird nach oben geschleudert
        } else if (isHorizontalCollision) {
            // Spieler nimmt Schaden
            if (collidingObject.lives > 0 && global.hitByBugInTheLast5Seconds === false) {
                collidingObject.lives -= 1;
                console.log(`You got hit! Remaining lives: ${collidingObject.lives}`);

                collidingObject.reactToHit(); // Treffer-Animation auslösen

                global.hitByBugInTheLast5Seconds = true;
                setTimeout(() => {
                    global.hitByBugInTheLast5Seconds = false;
                }, 3000);
            }

            if (collidingObject.lives <= 0) {
                console.log("Nooo, you died!");
            }
        }
    };

    startDyingAnimation = function () {
        console.log("Starting dying animation...");
        this.isDying = true;
        this.animationData.currentSpriteIndex = this.animationData.dyingAnimation.firstSpriteIndex;
        this.animationData.currentSpriteElapsedTime = 0;
    };

    playDyingAnimation = function () {
        const anim = this.animationData.dyingAnimation;
    
        // Sprite-Zeit hochzählen
        this.animationData.currentSpriteElapsedTime += global.deltaTime;
    
        if (this.animationData.currentSpriteElapsedTime >= anim.timePerSprite) {
            this.animationData.currentSpriteElapsedTime = 0;
    
            // Zum nächsten Sprite wechseln
            this.animationData.currentSpriteIndex++;
    
            // Debugging-Ausgabe
            console.log(
                `Dying animation progress: Frame ${this.animationData.currentSpriteIndex}/${anim.lastSpriteIndex}`
            );
    
            // Wenn die Animation vorbei ist
            if (this.animationData.currentSpriteIndex > anim.lastSpriteIndex) {
                console.log("Dying animation finished. Marking bug for deletion.");
                this.markForDeletion = true; // Bug nach Animation löschen
            }
        }
    };
    

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.startX = x;
        this.startY = y;
        this.loadImagesFromSpritesheet("./images/spritesheet_bug.png", 19, 1);
    }
}

export { Bug };
