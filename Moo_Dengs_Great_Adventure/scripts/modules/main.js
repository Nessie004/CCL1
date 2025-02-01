import { global } from "./global.js";
import { Hippo } from "../gameObjects/hippo.js";
import { MoveTrigger } from "../gameObjects/moveTrigger.js";
import { BlockObject } from "../gameObjects/blockObject.js";
import { Floor } from "../gameObjects/floor.js";
import { Food } from "../gameObjects/food.js";
import { WallObject } from "../gameObjects/wallObject.js";
import { Bug } from "../gameObjects/bug.js";
import { Tree } from "../gameObjects/tree.js";

const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const gameWonScreen = document.getElementById('gameWonScreen');  // Game Won Screen
const gameOverScreen = document.getElementById('gameOverScreen');  // Game Over Screen
const menuButton = document.getElementById('menuButton');

// menuButton.addEventListener('click', () => {
//   // Hauptmenü anzeigen
//   startScreen.style.display = 'flex';
//   resetGame();
//   console.log(22)

//   // Andere Screens ausblenden
//   gameOverScreen.classList.add('hidden');
//   gameWonScreen.classList.add('hidden');
  
//   // Lebensanzeige und Menü-Button ausblenden
//   toggleLivesDisplay(false);
//   menuButton.classList.add('hidden');

//   cancelAnimationFrame(global.animationFrameId);
//   global.allGameObjects = [];
// });

document.addEventListener("DOMContentLoaded", () => {
  const livesDisplay = document.getElementById("livesDisplay");
  livesDisplay.classList.add("hidden"); 

  //menuButton.classList.add("hidden"); 
});

startButton.addEventListener('click', () => {
  startScreen.style.display = 'none'; 
  toggleLivesDisplay(true);           
  //menuButton.classList.remove('hidden'); 
});

function showGameOverScreen() {
  gameOverScreen.classList.remove('hidden'); 
  toggleLivesDisplay(false);                
  //menuButton.classList.add('hidden');       
  cancelAnimationFrame(global.animationFrameId); 
}

function showGameWonScreen() {
  gameWonScreen.classList.remove('hidden'); 
  toggleLivesDisplay(false);               
  //menuButton.classList.add('hidden');      
  cancelAnimationFrame(global.animationFrameId); 
}

function resetGame() {
  gameOverScreen.classList.add('hidden'); 
  gameWonScreen.classList.add('hidden'); 
  toggleLivesDisplay(true);
  //menuButton.classList.remove('hidden'); 
  global.leftMoveTrigger.resetViewpoint();
  global.playerObject.lives = 3;  
  global.allGameObjects = [];
  global.foodCount = 0;

  setupGame();  
  requestAnimationFrame(gameLoop);  
}

function toggleLivesDisplay(visible) {
  const livesDisplay = document.getElementById("livesDisplay");
  if (visible) {
      livesDisplay.classList.remove("hidden");
  } else {
      livesDisplay.classList.add("hidden");
  }
}

startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  toggleLivesDisplay(true);
});

function checkGameOver() {
  if (global.playerObject.lives <= 0) {
    console.log("You died. Game over!");
    showGameOverScreen();
    return true; 
  }
  return false;
}

function checkGameWon() {
  if (global.foodCount === 0) { 
    console.log("Moo Deng is happy. You won!");
    showGameWonScreen();  
    return true; 
  }
  return false;
}

function gameLoop(totalRunningTime) { 
  global.deltaTime = totalRunningTime - global.prevTotalRunningTime; 
  global.deltaTime /= 1000; 
  global.prevTotalRunningTime = totalRunningTime; 
  global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height); 

  if (checkGameOver() || checkGameWon()) return;
  
  for (var i = 0; i < global.allGameObjects.length; i++) { 
    if (global.allGameObjects[i].active == true) {
      global.allGameObjects[i].storePositionOfPreviousFrame();
      global.allGameObjects[i].update();
      global.checkCollisionWithAnyOther(global.allGameObjects[i]);
      global.allGameObjects[i].applyGravity();
      global.allGameObjects[i].draw();
    }
  }

  function updateLivesDisplay() {
    const livesDisplay = document.getElementById("livesDisplay");

    switch (global.playerObject.lives) {
        case 3:
            livesDisplay.style.backgroundImage = "url('../images/HealthBar1.png')";
            break;
        case 2:
            livesDisplay.style.backgroundImage = "url('../images/HealthBar2.png')";
            break;
        case 1:
            livesDisplay.style.backgroundImage = "url('../images/HealthBar3.png')";
            break;
        case 0:
            livesDisplay.style.backgroundImage = "url('../images/HealthBar4.png')";
            break;
    }
  }

  for (let i = global.allGameObjects.length - 1; i >= 0; i--) {
    if (global.allGameObjects[i].markForDeletion) {
      global.allGameObjects.splice(i, 1); // Entferne das Objekt aus der Liste
    }
  }

  updateLivesDisplay();
  checkGameOver();
  requestAnimationFrame(gameLoop); 
}

function setupGame() {
  global.playerObject = new Hippo(80, 780, 64, 64);
  global.leftMoveTrigger = new MoveTrigger(50, 0, 20, 900000);
  global.rightMoveTrigger = new MoveTrigger(600, 0, 20, 900000);
  new Floor(0, 710, 9000, 9000);
  new BlockObject(750, 525, 70, 50);
  new BlockObject(820, 525, 70, 50);
  new BlockObject(680, 525, 70, 50);
  new BlockObject(500, 350, 70, 50);
  new BlockObject(240, 170, 70, 50);
  new BlockObject(310, 170, 70, 50);
  new WallObject(1400, 295, 190, 420);
  new BlockObject(1150, 525, 70, 50);
  new BlockObject(1050, 340, 70, 50);
  new BlockObject(1900, 340, 70, 50);
  new BlockObject(1970, 340, 70, 50);
  new BlockObject(2040, 340, 70, 50);
  new BlockObject(2300, 200, 70, 50);
  new BlockObject(2600, 120, 70, 50);
  new BlockObject(1590, 525, 70, 50);
  new Tree(2930, 310, 190, 400); 
  new BlockObject(2400, 525, 70, 50);
  new BlockObject(2470, 525, 70, 50);
  new BlockObject(2540, 525, 70, 50);

  const food1 = new Food(210, 40, 210, 130);
  const food2 = new Food(1530, 580, 210, 130);
  const food3 = new Food(2930, 180, 210, 130);

  global.allGameObjects.push(food1, food2, food3);
  global.foodCount = 3;

  let bug = new Bug(635, 430, 140, 110); 
  bug.maxMoveDistance = 150; 
  bug.yVelocity = 100; 
  global.allGameObjects.push(bug);

  let bug2 = new Bug(1360, 200, 140, 110); 
  bug2.maxMoveDistance = 150; 
  bug2.yVelocity = 100; 
  global.allGameObjects.push(bug2);

  let bug3 = new Bug(1850, 620, 140, 110); 
  bug3.maxMoveDistance = 150; 
  bug3.yVelocity = 100; 
  global.allGameObjects.push(bug3);

  let bug4 = new Bug(2370, 430, 140, 110); 
  bug4.maxMoveDistance = 150; 
  bug4.yVelocity = 100; 
  global.allGameObjects.push(bug4);
}

setupGame();
requestAnimationFrame(gameLoop);
let retryButtonGameOver = document.querySelector("#retry-Button-GameOver");
retryButtonGameOver.addEventListener("click", resetGame);

let retryButtonGameWon = document.querySelector("#retry-Button-GameWon");
retryButtonGameWon.addEventListener("click", resetGame );



