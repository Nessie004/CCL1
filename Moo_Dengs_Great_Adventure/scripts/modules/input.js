import { global } from "./global.js";

function move(event) {

    switch(event.key) {
        case "d":
            if (global.playerObject.xVelocity == 0)
                global.playerObject.switchCurrentSprites(7, 12);
            global.playerObject.xVelocity = 300;
            global.playerObject.yVelocity = 0;
            console.log("velocity set");
            break;
        case "a":
            if (global.playerObject.xVelocity == 0)
                global.playerObject.switchCurrentSprites(0, 5);
            global.playerObject.xVelocity = -300;
            global.playerObject.yVelocity = 0;
            break;
        case " ":
            global.playerObject.setJumpForce(12);
            break;
    
    }
}

function stop(event) {
    switch(event.key) {
        case "d":
            global.playerObject.xVelocity = 0;
            break;
        case "a":
            global.playerObject.xVelocity = 0;
            break;   
    }
}

document.addEventListener("keypress", move);

document.addEventListener("keyup", stop);