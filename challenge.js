/*!
@author Teboho Thabo Thage
@version 1.0.00

@Copyright (c) 2022, Teboho Thabo Thage
*/

" use strict";

import {config, gameState, gameResults,  sounds, recordedScores, GAMESTATE_KEY} from "./globals.js"
import Game from "./play.js"

export default class Challenge extends Phaser.Scene{
  constructor(){
    super("challenge");
  }
  
  init(){
    this.GUIdepth = {
        front: 1,
        back: 0,
        slide: 3,
        player: 2
    };
    // initial button state
    this.isButtonPressed = false;
    this.isButtonEnabled = false;
    
    this.endGame = false;
    this.isGameOver = false;
    this.roundCompleted = false;
    
    this.game = new Game(this, localStorage.getItem(GAMESTATE_KEY));//game logic controller
  }// init
  
  preload(){
    // Load game board
    this.load.image("board1", "img/board1.png");
    this.loadSounds();
    
    this.load.image("tick", "img/tick.png");
    this.load.image("cross", "img/cross.png");
    
    this.load.image("answer", "img/expr_button.png");
    this.load.image("player", "img/square.png");
    
   this.load.image("gameOver", "img/gameover.png");
  }// preload
  
  create(){
      this.cameras.main.setBackgroundColor("#000");
      
      // Add game board
      this.board1 = this.setBoardProperties("board1", config.width / 2, config.height / 2, this.GUIdepth.front, this.game);
      this.boardClickHandler(this.board1);
      
     // Adds score, time and answer indicator
     this.timeText = this.addGameHUD();
    
     // Adds button and expression label
     this.addGenButton();
     
    // adds player to the scene
    this.addPlayer();
    
    this.startText = this.add.text(50, config.height / 2 - 50 , "START", {fontSize: 70, color: "#ff0000", backgroundColor: "#ffffff"});
    this.startText.depth = this.GUIdepth.slide;
    
     this.time.addEvent({delay: 1500, callback: this.startSlide, callbackScope: this, loop: false});
     
    
    this.gameover = this.add.image(config.width / 2, config.height / 2, "gameOver");
    this.gameover.setScale(0.6324, 1);
    this.gameover.depth = this.GUIdepth.back;
    // Adds sounds to the scene
    [this.correctSound, this.incorrectSound, this.ladderUpSound, this.downSnakeSound, this.roundEndSound, this.gameEndSound] = this.addSounds();
    
    this.game.initializeGrid();
    this.game.init();
    this.MAX_TIME = this.game.counter;
    
    // Start the timer
    let timedEvent = this.time.addEvent({delay: 1000, callback: this.decreaseTimer, callbackScope: this, loop: true});
    
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
             this.scene.start("results");
      });
  }// create
  
  /**
   * Loads the sounds into the game
   */
  loadSounds(){
     this.load.audio("correctSound", sounds[0]);
     
     this.load.audio("incorrectSound", sounds[1]);
     
     this.load.audio("ladderUpSound", sounds[2]);
     
     this.load.audio("downSnakeSound", sounds[4]);
     
  this.load.audio("roundEndSound", sounds[6]);
  
  this.load.audio("gameEndSound", sounds[5]);
  }// loadSounds
  
  /**
   * Adds sounds to the scene
   */
  addSounds(){
     const correctSound = this.sound.add("correctSound");
     
     const incorrectSound = this.sound.add("incorrectSound");
     
     const ladderUpSound = this.sound.add("ladderUpSound");
  
     const downSnakeSound = this.sound.add("downSnakeSound");
     
     const roundEndSound = this.sound.add("roundEndSound");
     
     const gameEndSound = this.sound.add("gameEndSound");
     
     return [correctSound, incorrectSound, ladderUpSound, downSnakeSound, roundEndSound, gameEndSound];
  }// addSounds
  
  /**
   * Adds board to the scene
   * @param {string} url of the board image
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   * @param {number} depth  depth position
   */
  setBoardProperties(name, x, y, depth, game){
    const board = this.add.image(x, y, name);
    board.setScale(0.9885, 1);
    board.depth = depth;
    
    return board;
  }// setBoardProperties
  
  /**
   * Adds click events for the board
   * @param {Phaser.GameObjects.Image} board the game board
   */
  boardClickHandler(board){
    board.setInteractive();
    board.on("pointerdown", (pointer) => {
      if(this.isButtonPressed){
        this.isButtonPressed = false;
        this.game.updateMoveCount();
        this.game.getMousePos(pointer.x, pointer.y, board);
      }  
    });
  }// boardClickHandler
  
  /**
   * Adds the game HUD to the scene
   */
  addGameHUD(){
    // add score label
    this.scoreText = this.add.text(5, 3, "SCORE:1000000", {fontSize: 20, color: "#ffffff"});
    this.scoreText.setScale(1, 1.5);
    this.scoreText.depth = this.GUIdepth.front;
      
    // add time label
    this.tick = this.add.image(-250, 40, "tick");
    this.tick.setScale(0.15);
    this.tick.depth = this.GUIdepth.front;
    
    this.cross = this.add.image(-250, 40, "cross");
    this.cross.setScale(0.07);
    this.cross.depth = this.GUIdepth.back;
    
    const timeText = this.add.text(5, 40, "TIME:300", {fontSize: 20, color: "#ffffff"});
    timeText.setScale(1, 1.5);
    timeText.depth = this.GUIdepth.front;
    
    return timeText;
  }//addGameHUD
  
  /**
   * Adds button for creating random  arithmetic expressions
   */
  addGenButton(){
    // add button to generate expression
    this.btnGen = this.add.image(config.width / 2 - 70, 460, "answer");
    this.btnGen.setScale(0.5);
    this.btnGen.depth = this.GUIdepth.front
    const temp = this.btnGen;
    temp.setInteractive();
    temp.on("pointerdown", () => {
      if(this.isButtonEnabled && !this.isButtonPressed){
        this.tick.setPosition(-250, 40);
        this.cross.setPosition(-250, 40);
        this.isButtonPressed = true;
        this.btnGen.alpha = 0;
        this.game.generateExp();
          setTimeout(function() {
           temp.alpha = 1.0; }, 250);
      }
    }, this);   
      
    // add expression text
    this.expr = this.add.text(config.width / 2 + 30, 440, "0 + 0 =", {fontSize: 20, color: "#fff"});
    this.expr.setScale(1, 2);
    this.expr.depth = this.GUIdepth.front
  } //addGenButton
  
  /**
   * Adds player to the level
   */
  addPlayer(){
    this.player = this.add.image(0, config.height / 2, "player");
    this.player.setOrigin(0, 0);
    const TARGET_WIDTH = this.board1.displayWidth / 20; // desired player width
    const TARGET_HEIGHT = this.board1.displayHeight / 20; // desired player height
    const scaleX = TARGET_WIDTH / this.player.width;
    const scaleY = TARGET_HEIGHT / this.player.height;
    
    this.player.setScale(scaleX, scaleY);
    this.player.depth = this.GUIdepth.player
    
    const position = this.game.playerPosition;
    
    this.positionPlayer(parseInt(position[1]), parseInt(position[0]), this.board1);
  }//addPlayer
  
  /**
   * Returns new coordinates of player
   * @param {number} xIndex column index of cell
   * @param {number} yIndex row index of cell
   */
  setPlayerPosition(xIndex, yIndex, board){
    const NUM_COLS = 10
    const NUM_ROWS = 10;
    
    if(yIndex % 2 == 1) {
      	xIndex = NUM_COLS  - xIndex - 1;
     }
    const xCoord = this.player.displayWidth / 2 - 2.0  + xIndex * board.displayWidth / NUM_COLS;
    const yCoord = config.height / 2 + (board.displayHeight / 2) - 1.5 * this.player.displayHeight - yIndex * (board.displayHeight / NUM_ROWS);
    
    return {xCoord, yCoord};
   }//setPlayerPosition
  
  /**
   * Positions the player on the grid
   */
  positionPlayer(xIndex, yIndex, board) {
     const {xCoord, yCoord} = this.setPlayerPosition(xIndex, yIndex, board);
     this.player.setPosition(xCoord, yCoord);
  }// positionPlayer
  
  /**
   * Starts the animation that clears beginning round message
   */
  startSlide(){
      this.time.addEvent({delay: 0, callback: this.slideLeft, callbackScope: this, loop: true});
      this.isButtonEnabled = true;
  }// startSlide
  
  /**
   * Clears round beginning message
   */
  slideLeft(){
      if(this.startText.x >= -200){
        this.startText.x -= 10;
      }
  }// slideLeft
  
  /**
   * Decreases the timer
   */
  decreaseTimer(){
      if(this.game.gameover)return;
      if(this.game.counter <= 0){
          this.endRound();
          return;
      } 
      this.game.counter -= 1;
      this.timeText.text = `TIME: ${this.game.counter}`;
  }// decreaseTimer
  
  /**
   * Ends the current round
   */
  endRound(){
    this.isButtonEnabled = false;
    this.time.addEvent({delay: 1000, callback: this.enterGameOverState, callbackScope: this, loop: false});
  }// endRound
  
   /**
    * Ends the current game
    */
  enterGameOverState(){
      if(this.isGameOver) return;
      // Update global game state
      const state = JSON.parse(localStorage.getItem(GAMESTATE_KEY));
      state.totalTime += this.game.counter;
      // End the game after final round
      state.gameOver = true;
      this.isGameOver = true;
      this.gameover.depth = this.GUIdepth.slide;
      this.gameEndSound.play();
      
      localStorage.setItem(GAMESTATE_KEY, JSON.stringify(state));
      this.endGame = true;
  }// enterGameOverState
  
  /**
   * Starts fadeout into next scen
   */
 fadeToNextScene(){
    this.cameras.main.fadeOut(1000, 0, 0, 0);
  }// fadeToNextScene
  
  update(){
     if((this.game.gameover || this.game.finalPosition === "99") && !this.roundCompleted){
         this.roundCompleted = true;
         this.endRound();
     }
      
     if(this.isGameOver && this.endGame){
        this.endGame = false;
        this.isButtonEnabled = false;
        // Proceed to Results scene
        this.displayScoresResults();
      }
  }// update
  
  /**
   * Load next scene to display player final score
   */
  displayScoresResults(){
      this.time.addEvent({delay: 2500, callback: this.displayStats, callbackScope: this, loop: false});
      this.isButtonEnabled = true;
  }// displayScoresResults
  
  /**
   * Starts the animation for score display screen
   */
  displayStats(){
    const data = this.game.computeScore();
    
    gameResults.precision = data.precision;
    gameResults.playTime = data.playTime;
    gameResults.finalScore = data.finalScore;
    
     this.fadeToNextScene();
  }// displayStats
}
  
