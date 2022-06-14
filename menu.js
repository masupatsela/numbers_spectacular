/*!
@author Teboho Thabo Thage
@version 1.0.00

@Copyright (c) 2022, Teboho Thabo Thage
*/

"use strict";

import {gameState, difficulty, GAMESTATE_KEY, HIGH_SCORES_KEY} from "./globals.js"

export default class Menu extends Phaser.Scene{
  constructor(){
      super("menu");
  }
  
  init(){
    this.nextScene = "level";
  }// init
  
  preload(){}// preload
  
  create(){
      const [btnChallenge, btnPlay, btnResume, btnHighScore, btnHelp] = this.addMenuButtons("#333333");
      /* Adds event handlers to menu buttons*/
      this.addEvent(btnChallenge);
      this.addEvent(btnPlay);
      this.addEvent(btnResume);
      this.addEvent(btnHighScore);
      this.addEvent(btnResume);
      this.addEvent(btnHelp);
      
      /* Fades out to selected scene*/
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
         if(this.nextScene === "challenge"){
            this.scene.start("challenge");
         }
         else if(this.nextScene === "level"){
            this.scene.start("level");
         }
         else if(this.nextScene === "resume"){
            this.scene.start("level");
         }
         else if(this.nextScene === "highScores"){
            this.scene.start("highScores");
         }
         else {
             this.scene.start("game");
         } 
      });
   
  }// create
  
  /**
   * Adds a click event handler to menu button
   * @params {button} button 
   * @params {depth} order of how button should appear
   */
  addEvent(button){
      // Disable resume button if previous game was over
      if(button.y === 220){ 
        const state = JSON.parse(localStorage.getItem(GAMESTATE_KEY));
          if(state.isChallenge || state.gameOver){
            button.setStyle({color: "#000"});
            return;
          }
      }
      
      button.setInteractive();
      button.on("pointerdown", () => {
            button.setStyle({backgroundColor: "#000"});
        });
        
      button.on("pointerhover", () => {
            button.setStyle({backgroundColor: "#ffffff"});
       });
    
      button.on("pointerout", () => {
            button.setStyle({backgroundColor: "#333333"});
        });
      button.on("pointerup", () => {
            button.setStyle({backgroundColor: "#ffffff"});
            this.actionChooser(button.y);
            this.fadeToLevelScene();
        });
  }// addEvent
  
  /**
   * Chooses next scene to load
   * @param {number} yCoord coordinate of pressed button
   */
  actionChooser(yCoord){
      switch(yCoord){
          
        case 80: 
            const state1 = {...gameState, time: 15, difficulty: "Hard", isChallenge: true};
            localStorage.setItem(GAMESTATE_KEY, JSON.stringify(state1));
            this.nextScene = "challenge";
            break;
        case 150: 
            const state2 = {...gameState, difficulty: difficulty.mode};
            localStorage.setItem(GAMESTATE_KEY, JSON.stringify(state2));
            this.nextScene = "level";
            break;
        case 220: this.nextScene = "resume";
            break;
        case 290: this.nextScene = "highScores";
            break;
        default: this.nextScene = "game";
            break;
      }
  }// actionChooser
  
  /*
   * Adds buttons to placed in background for animation
   * @params {string} color background color of button after animation  
   */
  addMenuButtons(bgColor){
       let _btnChallenge = this.add.text(70, 80, "CHALLENGE", {
     fontFamily: "no_continue", fontWeight: "bold", fontSize: 80, color: "#ff00ff"});
       _btnChallenge.setScale(0.5);
       
       let _btnPlay = this.add.text(130, 150, "TOUR", {
           fontFamily: "no_continue", fontSize: 80, color: "#00ff00"});
       _btnPlay.setScale(0.5);
       
       let _btnResume = this.add.text(100, 220, "RESUME", {
           fontFamily: "no_continue", fontSize: 80, color: "#808080"});
       _btnResume.setScale(0.5)
       
       let _btnHighScore = this.add.text(70, 290, "HIGH SCORE", {
           fontFamily: "no_continue",  fontSize: 80, color: "#0000ff"});
       _btnHighScore.setScale(0.5);
       
       let _btnHelp = this.add.text(130, 360, "BACK", {
           fontFamily: "no_continue", fontSize: 80, color: "#ff0000"});
       _btnHelp.setScale(0.5);
       
       return [_btnChallenge, _btnPlay, _btnResume, _btnHighScore, _btnHelp];
  }// addMenuButtons
  
  /*
   * Sets the depth of menu buttons
   * @params {number} depth depth of buttons
   * @params {array} btnArr array of buttons
  */
  setDepth(depth, btnArr){
      btnArr[0].depth = depth;
      btnArr[1].depth = depth;
      btnArr[2].depth = depth;
      btnArr[3].depth = depth;
      btnArr[4].depth = depth;
  }// setDepth
  
  /**
   * Sets delay before fadeout and starts fadeout
   */
  fadeToLevelScene(){
     this.cameras.main.fadeOut(1000, 0, 0, 0);
  }// fadeToLevelScene
    
    
}