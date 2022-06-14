"use strict";

import {config, HIGH_SCORES_KEY} from "./globals.js"

export default class Scores extends Phaser.Scene {
    constructor() {
        super("highScores");
    }
    
    init(){
        this.scores = JSON.parse(localStorage.getItem(HIGH_SCORES_KEY));
    }// init
    
    preload(){}// preload
    
    create(){
    // Heading
   this.add.text(70, 50, `TOP 5 SCORES`, {fontFamily: "Irish_Grover", fontSize: 30, color: "#ff0000"});
   
   
   // Usernames  
   this.displayUserNames();
   
   // Scores
   this.displayUserScores();
   
   const _btnClose = this.addButton("#333333");
   
   /* Adds event handler for button */
      this.addEvent(_btnClose);
   
   /* Fades out to menu scene*/
      this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start("menu");
      });
    }// create
    
    displayUserNames(){
      // Username 1
      this.add.text(config.width / 2 - 150, config.height / 2 - 100, `1. ${this.scores[0].name}`, {fontFamily: "Irish_Grover", fontSize: 25, color: "#ff0000"});
      // Username 2
       this.add.text(config.width / 2 - 150, config.height / 2 - 50, `2. ${this.scores[1].name}`, {fontFamily: "Irish_Grover",
            fontSize: 25, color: "#ff0000"});
      // Username 3
       this.add.text(config.width / 2 - 150, config.height / 2, `3. ${this.scores[2].name}`, {fontFamily: "Irish_Grover",
           fontSize: 25, color: "#ff0000"});
      // Username 4
       this.add.text(config.width / 2 - 150, config.height / 2 + 50, `4. ${this.scores[3].name}`, { 
            fontFamily: "Irish_Grover",
           fontSize: 25, color: "#ff0000"});
      // Username 5
        this.add.text(config.width / 2 - 150, config.height / 2 + 100, `5. ${this.scores[4].name}`, {
             fontFamily: "Irish_Grover",
            fontSize: 25, color: "#ff0000"});
    }// displayUserNames
    
    displayUserScores(){
      // Score 1
      this.add.text(config.width / 2 + 40, config.height / 2 - 100, `${this.scores[0].score}`, {fontFamily: "Irish_Grover", fontSize: 25, color: "#ff0000"});
      // Score 2
      this.add.text(config.width / 2 + 40, config.height / 2 - 50, `${this.scores[1].score}`, {fontFamily: "Irish_Grover",
          fontSize: 25, color: "#ff0000"});
      // Score 3
      this.add.text(config.width / 2 + 40, config.height / 2, `${this.scores[2].score}`, {fontFamily: "Irish_Grover",
          fontSize: 25, color: "#ff0000"});
      // Score 4
      this.add.text(config.width / 2 + 40, config.height / 2 + 50, `${this.scores[3].score}`, {fontFamily: "Irish_Grover",
          fontSize: 25, color: "#ff0000"});
      // Score 5
      this.add.text(config.width / 2 + 40, config.height / 2 + 100, `${this.scores[4].score}`, {fontFamily: "Irish_Grover",
          fontSize: 25, color: "#ff0000"});
    }// displayUserScores
    
  /*
   * Adds button to close score screen
   * @params {string} color background color of button after animation  
   */
  addButton(bgColor){
       let _btnClose = this.add.text(100, 420, "CLOSE", {fontFamily: "no_continue", fontSize: 60, color: "#00ff00"});
       _btnClose.setScale(0.5);
       
      return _btnClose; 
       
  }// addButton
  /**
   * Adds a click event handler to menu button
   * @params {button} button 
   * @params {depth} order of how button should appear
   */
  addEvent(button){
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
            this.fadeToLevelScene();
        });
  }// addEvent
  
   /**
   * Sets delay before fadeout and starts fadeout
   */
  fadeToLevelScene(){
     this.cameras.main.fadeOut(1000, 0, 0, 0);
  }// fadeToLevelScene
    
}
