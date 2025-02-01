import { global } from "../modules/global.js";

class BaseGameObject {
    active = true;
    name = "";
    x = 100;
    y = 500;
    previousX = 0;
    previousY = 0;
    width = 50;
    height = 50;
    useGravityForces = false;
    blockGravityForces = false;
    index = -1;

    physicsData = {
        fallVelocity: 0,
        terminalVelocity: 53,
        jumpForce: 0,
        prevFallingVelocity: 0,
        jumpForceDecay: 4,
        isGrounded: false,
    };

    animationData = {
        animationSprites: [],
        timePerSprite: 0.08,
        currentSpriteElapsedTime: 0,
        firstSpriteIndex: 0,
        lastSpriteIndex: 0,
        currentSpriteIndex: 0,
    };

    storePositionOfPreviousFrame = function () {
        this.previousX = this.x;
        this.previousY = this.y;
    };

    getBoxBounds = function () {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height,
        };
    };

    update = function () {};

    applyGravity = function () {
        if (!this.useGravityForces) return;

        this.handleFallVelocity();
        this.y += (this.physicsData.fallVelocity * global.deltaTime + this.physicsData.prevFallingVelocity) / 2;
        this.physicsData.prevFallingVelocity = this.physicsData.fallVelocity * global.deltaTime;

        this.handleCollisions();
    };

    handleFallVelocity = function () {
        this.physicsData.fallVelocity += global.gravityForce * global.deltaTime * global.pixelToMeter;

        if (this.physicsData.jumpForce > 0) {
            this.physicsData.fallVelocity +=
                -(global.gravityForce * global.deltaTime * global.pixelToMeter) +
                (global.gravityForce * global.deltaTime * global.pixelToMeter) * this.physicsData.jumpForceDecay;

            if (this.physicsData.isGrounded) {
                this.physicsData.fallVelocity = -this.physicsData.jumpForce * global.pixelToMeter;
                this.physicsData.prevFallingVelocity = this.physicsData.fallVelocity * global.deltaTime;
            }

            this.physicsData.isGrounded = false;

            if (this.physicsData.fallVelocity >= 0) {
                this.physicsData.jumpForce = 0;
            }
        }

        if (this.physicsData.fallVelocity > this.physicsData.terminalVelocity * global.pixelToMeter) {
            this.physicsData.fallVelocity = this.physicsData.terminalVelocity * global.pixelToMeter;
        }
    };

    handleCollisions = function () {
        for (let i = 0; i < global.allGameObjects.length; i++) {
            let otherObject = global.allGameObjects[i];
            if (otherObject.active && otherObject.blockGravityForces) {
                let collisionHappened = global.detectBoxCollision(this, otherObject);
                if (collisionHappened) {
                    this.resolveCollision(otherObject);
                }
            }
        }
    };

    resolveCollision = function (otherObject) {
        if (this.physicsData.fallVelocity > 0) {
            this.physicsData.isGrounded = true;
            this.y =
                otherObject.getBoxBounds().top - 
                this.height - 
                (this.getBoxBounds().bottom - (this.y + this.height)) - 
                global.deltaTime * 0.1;
        } else if (this.physicsData.fallVelocity < 0) {
            this.y =
                otherObject.getBoxBounds().bottom - 
                (this.getBoxBounds().top - this.y) - 
                global.deltaTime * 0.1;
        }

        this.physicsData.jumpForce = 0;
        this.physicsData.fallVelocity = 0;
        this.physicsData.prevFallingVelocity = 0;
    };

    setJumpForce = function (jumpForce) {
        if (this.physicsData.isGrounded) {
            this.physicsData.jumpForce = jumpForce;
        }
    };

    draw = function () {
        let sprite = this.getNextSprite();
        global.ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
    };

    getNextSprite = function () {
        this.animationData.currentSpriteElapsedTime += global.deltaTime;

        if (this.animationData.currentSpriteElapsedTime >= this.animationData.timePerSprite) {
            this.animationData.currentSpriteElapsedTime = 0;
            this.animationData.currentSpriteIndex++;
            console.log(`Switching to sprite index: ${this.animationData.currentSpriteIndex}`); // Debugging
            if (this.animationData.currentSpriteIndex > this.animationData.lastSpriteIndex) {
                this.animationData.currentSpriteIndex = this.animationData.firstSpriteIndex;
            }
        }
        const sprite = this.animationData.animationSprites[this.animationData.currentSpriteIndex];
        if (!sprite) console.error(`Sprite at index ${this.animationData.currentSpriteIndex} is undefined!`); // Debugging
        return sprite;
    };

    loadImages = function (imageSources) {
        for (let i = 0; i < imageSources.length; i++) {
            let image = new Image();
            image.src = imageSources[i];
            this.animationData.animationSprites.push(image);
        }
    };

    loadImagesFromSpritesheet = function (spritesheetPath, cols, rows) {
        const totalSprites = cols * rows;
        this.animationData.animationSprites = Array.from({ length: totalSprites }, () => new Image());

        const spritesheet = new Image();
        spritesheet.src = spritesheetPath;

        spritesheet.addEventListener("load", () => {
            const spritesheetWidth = spritesheet.width;
            const spritesheetHeight = spritesheet.height;
            const singleSpriteWidth = Math.floor(spritesheetWidth / cols);
            const singleSpriteHeight = Math.floor(spritesheetHeight / rows);

            const tempSpritesheetCanvas = document.createElement("canvas");
            const tempSpritesheetCtx = tempSpritesheetCanvas.getContext("2d");
            tempSpritesheetCanvas.width = singleSpriteWidth;
            tempSpritesheetCanvas.height = singleSpriteHeight;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    tempSpritesheetCtx.clearRect(0, 0, singleSpriteWidth, singleSpriteHeight);
                    tempSpritesheetCtx.drawImage(
                        spritesheet,
                        col * singleSpriteWidth,
                        row * singleSpriteHeight,
                        singleSpriteWidth,
                        singleSpriteHeight,
                        0,
                        0,
                        singleSpriteWidth,
                        singleSpriteHeight
                    );

                    const index = row * cols + col;
                    this.animationData.animationSprites[index].src = tempSpritesheetCanvas.toDataURL();
                    console.log(`Loaded sprite index ${index}`); // Debugging
                }
            }
        });
    };

    switchCurrentSprites = function (firstSpriteIndex, lastSpriteIndex) {
        console.log(`Switching animation range: ${firstSpriteIndex} to ${lastSpriteIndex}`);
        this.animationData.currentSpriteIndex = firstSpriteIndex;
        this.animationData.firstSpriteIndex = firstSpriteIndex;
        this.animationData.lastSpriteIndex = lastSpriteIndex;
    };

    reactToCollision = function (collidingObject) {};

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.previousX = x;
        this.previousY = y;
        global.allGameObjects.push(this);
        this.index = global.allGameObjects.length - 1;
    }
}

export { BaseGameObject };
