/*!
@author Teboho Thabo Thage
@version 1.0.00

@Copyright (c) 2022, Teboho Thabo Thage
*/

"use strict";

import {
    config, gameResults, HIGH_SCORES_KEY
} from "./globals.js"

export default class Results extends Phaser.Scene {
    constructor() {
        super("results");
    }

    init() {
        this.nextScene = "game";
        this.finalScore = 0;
    }

    preload() {}

    create() {
        // Add the display labels
        this.addDisplayLabels(gameResults);

        const [btnRegister,
            btnClose] = this.addButtons("#333333");

        /* Adds event handlers for buttons*/
        this.addEvent(btnRegister);
        this.addEvent(btnClose);
        // Disable register button if score is not in top 5
        const state = JSON.parse(localStorage.getItem(HIGH_SCORES_KEY));
        
        if(state[4].score >= gameResults.finalScore){
            btnRegister.visible = false;
        }
        
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            if (this.nextScene === "register") {
                this.scene.start("register");
            } else {
                this.scene.start("menu");
            }
        });
    }// create

    /**
    * Adds labels that display game results
    * @params {number} precision score after player performance is included
    * @param {number} playTime time bonus
    * @params {number} finalScore total points accumulated
    */
    addDisplayLabels({precision,
        playTime,
        finalScore}) {
        this.scoreLabel = this.add.text(60,
            config.height / 2 - 100,
            "Score",
            {
                fontSize: 25,
                color: "#00ff00"
            });

        this.scoreAmount = this.add.text(200,
            config.height / 2 - 100,
            `${precision}`,
            {
                fontSize: 25,
                color: "#00ff00"
            });

        this.timeLabel = this.add.text(60,
            config.height / 2 - 50,
            "Time",
            {
                fontSize: 25,
                color: "#00ff00"
            });

        this.time = this.add.text(200,
            config.height / 2- 50,
            `${playTime}`,
            {
                fontSize: 25,
                color: "#00ff00"
            });

        this.totalLabel = this.add.text(60,
            config.height / 2,
            "Total",
            {
                fontSize: 25,
                color: "#00ff00"
            });

        this.total = this.add.text(200,
            config.height / 2,
            `${finalScore}`,
            {
                fontSize: 25,
                color: "#00ff00"
            });
    }// addDisplayLabels

    /**
    * Adds a click event handler to button
    * @params {button} button
    * @params {depth} order of how button should appear
    */
    addEvent(button) {
        button.setInteractive();
        button.on("pointerdown",
            () => {
                button.setStyle({
                    backgroundColor: "#000000"
                });
                this.actionChooser(button.y);
            });

        button.on("pointerhover",
            () => {
                button.setStyle({
                    backgroundColor: "#ffffff"
                });
            });

        button.on("pointerout",
            () => {
                button.setStyle({
                    backgroundColor: "#333333"
                });
            });
        button.on("pointerup",
            () => {
                button.setStyle({
                    backgroundColor: "#ffffff"
                });
                this.fadeToNextScene();
            });
    }// addEvent

    /**
     *  Adds buttons for navigating to next scenes
   * @params {string} color background color of button
   */
    addButtons(bgColor) {
        let _btnRegister = this.add.text(80,
            config.height / 2 + 50,
            "Register",
            {
                fontSize: 70,
                color: "#ff00ff",
                backgroundColor: bgColor
            });
        _btnRegister.setScale(0.5);

        let _btnClose = this.add.text(100,
            config.height / 2 + 100,
            "Close",
            {
                fontSize: 70,
                color: "#00ff00",
                backgroundColor: bgColor
            });
        _btnClose.setScale(0.5);

        return [_btnRegister, _btnClose];
    }// addButtons

    /**
    * Chooses next scene to load
    * @param {number} xCoord coordinate of pressed button
    */
    actionChooser(yCoord) {
        const midScreenHeight = config.height / 2;
        if (yCoord === (midScreenHeight + 50)) {
            this.nextScene = "register";
        } else if (yCoord === (midScreenHeight + 100)) {
            this.nextScene = "menu";
        }
    }// actionChooser

    /**
    * Sets delay before fadeout and starts fadeout
    */
    fadeToNextScene() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
    }// fadeToNextScene
}