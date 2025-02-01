import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

class Hippo extends BaseGameObject {
    name = "Hippo";
    xVelocity = 0;
    yVelocity = 0;
    width = 260;
    height = 200;
    useGravityForces = true;
    lives = 3;

    isHit = false; 
    hitSpritesheet = null; 

    hitAnimationData = {
        firstSpriteIndex: 14,    
        lastSpriteIndex: 21,
        timePerSprite: 0.10,  
        isAnimating: false,
        animationEndCallback: null
    };

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.loadImagesFromSpritesheet("./images/spritesheet.png", 22, 1);
        this.lives = 3;
    }

    update = function() {
        if (this.isHit) {
            this.manageHitAnimation(); 
        } else {
            // Normale Bewegung, wenn der Charakter nicht getroffen ist
            this.x += this.xVelocity * global.deltaTime;
            this.y += this.yVelocity * global.deltaTime;
            
            // Wenn der Charakter stillsteht, zeigt er ein Standbild
            if (this.xVelocity === 0 && this.yVelocity === 0) {
                this.switchCurrentSprites(
                    this.animationData.firstSpriteIndex,
                    this.animationData.firstSpriteIndex
                );
            }
        }
    };

    manageHitAnimation = function () {
        if (!this.hitAnimationData.isAnimating) {
            // Starte die Treffer-Animation
            this.switchCurrentSprites(
                this.hitAnimationData.firstSpriteIndex,
                this.hitAnimationData.lastSpriteIndex
            );
            this.hitAnimationData.isAnimating = true;

            // Optionale Geschwindigkeit anpassen, falls nötig
            this.xVelocity = 0;
            this.yVelocity = 0;
        } else if (
            this.animationData.currentSpriteIndex === this.hitAnimationData.lastSpriteIndex &&
            this.animationData.currentSpriteElapsedTime === 0
        ) {
            // Animation ist beendet
            this.isHit = false; // Zustand zurücksetzen
            this.hitAnimationData.isAnimating = false;

            // Zurück zur normalen Animation
            this.switchCurrentSprites(
                this.animationData.firstSpriteIndex,
                this.animationData.firstSpriteIndex
            );

            // Führe den Animation-Ende-Callback aus, falls gesetzt
            if (this.hitAnimationData.animationEndCallback) {
                this.hitAnimationData.animationEndCallback();
            }

            // Bewegung nach der Animation wiederherstellen (falls gewünscht)
            this.xVelocity = 0; // Ursprünglich oder gewollte Geschwindigkeit hier einfügen
            this.yVelocity = 0; // Ursprünglich oder gewollte Geschwindigkeit hier einfügen
        }
    };

    reactToHit = function () {
        this.isHit = true; // Setze den Zustand "getroffen"
        this.hitAnimationData.isAnimating = false; // Animation neu starten

        // Geschwindigkeit anpassen, falls der Charakter stillstehen soll
        this.xVelocity = 0;
        this.yVelocity = 0;
    };

    getBoxBounds = function () {
        let bounds = {
            left: this.x + 55,
            right: this.x + this.width - 55,
            top: this.y + 38,
            bottom: this.y + this.height - 37
        };
        return bounds;
    }
}

export { Hippo };
