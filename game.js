/*!
@author Teboho Thabo Thage
@version 1.0.00

@Copyright (c) 2022, Teboho Thabo Thage
*/

"use strict";

import {
    config, difficulty, sounds, gameState, recordedScores, GAMESTATE_KEY, HIGH_SCORES_KEY
} from "./globals.js"

export default class Game extends Phaser.Scene {
    constructor() {
        super("game");
    }
    
    init(){
       // Set default game state
       if(localStorage.getItem(GAMESTATE_KEY) == null){
          localStorage.setItem(GAMESTATE_KEY, JSON.stringify(gameState));
       }
       // Set default high scores  
      if(localStorage.getItem(HIGH_SCORES_KEY) == null){
         localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(recordedScores));
      }
    }// init
     
    
    preload() {
        this.introMusic = this.load.audio("intro", sounds[3]);
        this.load.image("splash", "img/splash02.png");
        this.load.image("introLabel", "img/splash-mode-label.png");
    }// preload
    
    create() {
        this.WINDOW_CENTER_X = config.width / 2; // x screen center coordinate
        this.WINDOW_CENTER_Y = config.height / 2; // y screen center coordinate
        // Add splash image
        this.addBackground();
        
        // Fade to the menu scene
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.start("menu");
        });
        
        // Play splash screen music
        let music = this.sound.add("intro");
        music.play();

       this.style1 = {
            fontFamily: "no_continue",
            backgroundColor: "#ff0000",
            fontSize: 200,
            color: "#fff"
        };
        
        // Add buttons for choosing mode
        this.easyRedButton = this.addModeButtons(this.WINDOW_CENTER_X - 90, this.WINDOW_CENTER_Y + 180, "Easy");
        
        this.easyRedButton.setInteractive();
        this.easyRedButton.on("pointerdown", () => {
            this.easyRedButton.setStyle({backgroundColor: "#00FF00"});
            difficulty.mode = "Easy";
            this.fadeToMenuScene(music);
        }, this);
        
        this.hardRedButton = this.addModeButtons(this.WINDOW_CENTER_X + 30, this.WINDOW_CENTER_Y + 180, "Hard");
        
        this.hardRedButton.setInteractive();
        this.hardRedButton.on("pointerdown", (e) => {
            this.hardRedButton.setStyle({backgroundColor: "#00FF00"});
            difficulty.mode = "Hard";
            this.fadeToMenuScene(music);
        }, this);
    }// create 
    
    /**
     * Adds the scene's background
     */
    addBackground() {
        let splashImage = this.add.image(0, 0, "splash")
        splashImage.setPosition(this.WINDOW_CENTER_X, this.WINDOW_CENTER_Y);
        splashImage.setScale(0.5, 0.5);
        splashImage.depth = 0;

        let introLabel = this.add.image(0, 0, "introLabel");
        introLabel.setScale(0.8);//1.5
        introLabel.setPosition(this.WINDOW_CENTER_X - 10, this.WINDOW_CENTER_Y + 100);
        introLabel.depth = 1;
    }// addBackground
    
    /**
     * @param {Phaser.WebAudioSound} music sound to be played during fading out of scene
     */
    fadeToMenuScene(music){
        setTimeout(() => {
            music.stop();
            this.cameras.main.fadeOut(1000, 0, 0, 0);}, 1000);
    }
    
    /**
     * @param {number} xPos  x coordinate
     * @param {number} yPos  y coordinate
     * @param {object} style1 style to be applied
     */
    addModeButtons(xPos, yPos, buttonName) {
        const fgButton = this.add.text(xPos, yPos, buttonName, this.style1);
        fgButton.setScale(0.125);
        fgButton.setRotation(Math.PI / 4 * -1);
        
        return fgButton;
    }// addModeButtons

    update() {}
}