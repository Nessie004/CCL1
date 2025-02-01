const global = {};

global.canvas = document.querySelector("#gameCanvas");  
global.ctx = global.canvas.getContext("2d");

global.prevTotalRunningTime = 0;
global.deltaTime = 0;
global.allGameObjects = [];
global.playerObject = {};
global.backgroundShift = 0;
global.backgroundMaxShift = -2500;
global.gravityForce = 9.8;
global.pixelToMeter = 100;
global.leftMoveTrigger;
global.rightMoveTrigger;
global.hitByBugInTheLast5Seconds = false;

global.getCanvasBounds = function () {
    let bounds =  {
        "left": 0,
        "right": this.canvas.width,
        "top": 0, 
        "bottom": this.canvas.height
    };
    return bounds;
};

global.isOutOfBounds = function (gameObject) {
    let canvasBounds = this.getCanvasBounds();
    return (
        gameObject.x + gameObject.width < canvasBounds.left || 
        gameObject.x > canvasBounds.right ||  
        gameObject.y + gameObject.height < canvasBounds.top || 
        gameObject.y > canvasBounds.bottom     
    );
};

global.checkCollisionWithAnyOther = function (givenObject) {
    for (let i = 0; i < global.allGameObjects.length; i++) {
        let otherObject = global.allGameObjects[i];
        if (givenObject !== otherObject && otherObject.active) {
            let collisionHappened = this.detectBoxCollision(givenObject, otherObject);

            if (collisionHappened) {
                if (givenObject.name === "Hippo" && otherObject.name === "Bug") {
                    const givenBounds = givenObject.getBoxBounds();
                    const otherBounds = otherObject.getBoxBounds();

                    const isPlayerAbove = givenBounds.bottom <= otherBounds.top + 10;
                    const isHorizontalCollision =
                        givenBounds.right > otherBounds.left &&
                        givenBounds.left < otherBounds.right;

                    if (isPlayerAbove && isHorizontalCollision) {
                        console.log("Bug is defeated!");
                        otherObject.markForDeletion = true; 
                        givenObject.yVelocity = -300;
                    }
                }

                givenObject.reactToCollision(otherObject);
                otherObject.reactToCollision(givenObject);
            }
        }
    }
};




global.detectBoxCollision = function (gameObject1, gameObject2) {
    let box1 = gameObject1.getBoxBounds();
    let box2 = gameObject2.getBoxBounds();
    if (gameObject1 != gameObject2) {
        if (box1.top <= box2.bottom && 
            box1.left <= box2.right && 
            box1.bottom >= box2.top &&
            box1.right >= box2.left) {
            return true;
        }
    }
    return false;
};

global.filterVisibleObjects = function () {
    this.allGameObjects = this.allGameObjects.filter((gameObject) => {
        return !this.isOutOfBounds(gameObject);  
    });
};

export { global };
