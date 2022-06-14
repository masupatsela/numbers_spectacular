/*!
@author Teboho Thabo Thage
@version 1.0.00

@Copyright (c) 2022, Teboho Thabo Thage
*/

"use strict";

import {
    config, 
    HIGH_SCORES_KEY, gameResults
} from "./globals.js"

export default class Register extends Phaser.Scene {
    constructor() {
        super("register");
    }

    init() {
        this.slots = []; // placeholders for username symbols
        this.code = 97; // ASCII Code for currently displayed character
        this.listIndex = 0; // Index of placeholder position to display character
        this.slotsMarkers = [] // Underlines that mark the placeholders
    }// init

    preload() {} //preload

    create() {
        this.cameras.main.setBackgroundColor("#000000");
        
        // Add heading
        this.add.text(30, 50, "Enter your username", {
            fontSize: 25, color: "#ff0000"
        });

        // Add username slots
        this.addUsernameSlots();

        // Add the register buttons
        [this.btnPrevious,
            this.btnNext,
            this.btnSelect] = this.addButtons("#333333");

        /* Adds event handlers for buttons*/
        this.addEvent(this.btnPrevious);
        this.addEvent(this.btnNext);
        this.addEvent(this.btnSelect);

        // Start the next scene
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            // Reset player stats
            gameResults.precision = 0;
            gameResults.playTime = 0;
            gameResults.finalScore = 0;
            // Proceed to menu
            this.scene.start("menu");
        });
    }// create

    /**
    * Add slots for username
    */
    addUsernameSlots() {
        const LETTER_SPACING = 50;
        const LINE_SPACING = 20;
        let xCoord = config.width / 2 - 140;
        let xCoord2 = config.width / 2 - 150;

        for (let i = 1; i <= 6; i++) {
            let slot = this.add.text(xCoord, config.height / 2 - 100, " ", {
                fontSize: 40, color: "#00ff00"
            });
            this.slots.push(slot);

            let marker = this.add.text(xCoord2, config.height / 2 - 90, "__", {
                fontSize: 40, color: "#00ff00"
            });
            if (i === 1) marker.setStyle({
                color: "#ff0000"
            });
            this.slotsMarkers.push(marker);

            xCoord += LETTER_SPACING;
            xCoord2 += LETTER_SPACING;
        }
    }// addUsernameSlots

    /*
   * Adds buttons for navigating to next scenes
   * @params {string} color background color of button
   */
    addButtons(bgColor) {
        let _btnPrevious = this.add.text(80,
            config.height / 2 + 50,
            "-",
            {
                fontSize: 70,
                color: "#fff",
                backgroundColor: bgColor
            });
        _btnPrevious.setScale(2, 0.5);

        let _btnNext = this.add.text(180,
            config.height / 2 + 50,
            "+",
            {
                fontSize: 70,
                color: "#fff",
                backgroundColor: bgColor
            });
        _btnNext.setScale(2, 0.5);

        let _btnSelect = this.add.text(100,
            config.height / 2 + 100,
            "Select",
            {
                fontSize: 70,
                color: "#fff",
                backgroundColor: bgColor
            });
        _btnSelect.setScale(0.5);

        return [_btnPrevious,
            _btnNext,
            _btnSelect];
    }// addButtons

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
                this.actionChooser(button.x);
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
            });
    }// addEvent

    /**
    * Chooses fowards or backwards for traversing symbol list
    * @param {number} xCoord coordinate of pressed button
    */
    actionChooser(xCoord) {
        switch (xCoord) {
            // Previous button pressed
            case 80: this.setChar("previous");
                break;
            // Select button pressed
            case 100: this.setCurrentPosition();
                break;
            // Next button pressed
            case 180: this.setChar("next");
                break;
        }
    }// actionChooser

    /**
    * Sets delay before fadeout and starts fadeout
    */
    fadeToNextScene() {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
    }// fadeToLevelScene

    /**
    * Selects character by moving backwards in symbol list
    * @param {number} code ASCII code
    * @returns {number} An ASCII character
    */
    getPreviousChar(code) {
        switch (code) {
            case 32: code = 65;
                break;
            case 48: code = 122;
                break;
            case 60: code = 57;
                break;
            case 65: code = 60;
                break;
            case 97: code = 90;
                break;
            default: --code;
                break;
        }
        return code;
    }// getPreviousChar

    /**
    * Selects a character by moving forward in symbol list
    * @param {number} code ASCII code
    * @returns A character
    */
    getNextChar(code) {
        switch (code) {
            case 32: code = 65;
                break;
            case 57: code = 60;
                break;
            case 60: code = 65;
                break;
            case 90: code = 97;
                break;
            case 122: code = 48;
                break;
            default: ++code;
                break;
        }
        return code;
    }// getNextChar

    /**
    * Displays the currently selected symbol for username
    * @param {number} action direction which indicates how to traverse symbol list
    */
    setChar(action) {
        let currentChar = this.slots[this.listIndex].text;
        let charAscii = currentChar.charCodeAt(0);
        let asciiCode = 97; // ascii - a
        
        if (action === "previous") {
            asciiCode = this.getPreviousChar(charAscii);
        } else if (action === "next") {
            asciiCode = this.getNextChar(charAscii);
        } // if-else

        this.slots[this.listIndex].text = String.fromCharCode(asciiCode);
    }// setChar

    /**
    * Selects the position where next chosen symbol will be displayed
    */
    setCurrentPosition() {
        if ((this.listIndex < 0) || (this.listIndex >= this.slots.length)) return;
        this.slotsMarkers[this.listIndex].setStyle({
            color: "#00ff00"
        });

        let char = this.slots[this.listIndex].text
        if (char === "<" && this.listIndex > 0) {
            this.listIndex = this.listIndex - 1;
        } else if (char !== "<" && (this.listIndex < this.slots.length)) {
            this.listIndex = this.listIndex + 1;
        }
        
        // Disable previous and next buttons after last symbol entered
        if (this.listIndex === this.slots.length) {
            this.btnPrevious.visible = false;
            this.btnNext.visible = false;
            
            // Record player username and score
            let username = this.getUsername();
            const scores = this.registerUser(username, gameResults.finalScore);
            localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(scores));
            
            // Proceed to splash screen
            this.time.addEvent({
                delay: 1000, callback: this.fadeToNextScene, callbackScope: this, loop: false
            });
        }
        // Set previous active slot indicator white
        if (this.listIndex < this.slotsMarkers.length)
            this.slotsMarkers[this.listIndex].setStyle({
            color: "#ff0000"
        });
    }// setCurrentPosition
    
    /**
     * Combines placeholder symbols to create username
     * @returns {string} username 
     */
    getUsername() {
        let username = "";
        for (let slot of this.slots) {
            username += slot.text;
        }
    
        return username.trim();
    }// getUsername
    
    /**
     * Adds username and score to high scores list
     */
    registerUser(name, score) {
        // Find position in array to insert
        let index = -1;
        let scores = JSON.parse(localStorage.getItem(HIGH_SCORES_KEY));

        for (let i = scores.length - 1; i >= 0; i--) {
            if (scores[i].score < score) {
                index = i;
            }// if
        }// for

        const newArr = []; // Updated high scores
        for (let i = 0; i < scores.length; i++) {
            if (index === i) {
                newArr.push({
                    name, score
                });
            }// if
            newArr.push(scores[i]);
        }// for

        if (newArr.length == 6) newArr.pop();
        return newArr;
    }// registerUser
}