/*!
@author Teboho Thabo Thage
@version 1.0.00

@Copyright (c) 2022, Teboho Thabo Thage
*/

"use strict "

import {
    sounds,
    config,
    GAMESTATE_KEY
} from "./globals.js"

// Game board cell
class Cell {
    constructor(index, leftX, bottomY) {
        this.index = index
        this.left = leftX
        this.bottom = bottomY
    }

    set setLeftX(x) {
        this.left = x;
    }

    get getLeftX() {
        return this.left;
    }

    set setBottomY(y) {
        this.bottom = y;
    }

    get getBottomY() {
        return this.bottom;
    }

    get id() {
        return this.index;
    }
}

const cells = [[], [], [], [], [], [], [], [], [], []] // Board game squares
const gameBoards = ["img/board1.png", "img/board2.jpg", "img/board3.jpg", "img/board4.jpg", "img/board5.jpg"]

/**
 * Locates cell on board
 * @param {Phaser.GameObject.Image} board the game board
 * @param {number} xCoord x coordinate
 * @param {number} yCoord y coordinate
 * @param {number} cellWidth width of cellWidth
 * @param {number} cellHeight height of cellHeight
 */
function findCell(board, xCoord, yCoord, cellWidth, cellHeight) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let leftBorder = board[i][j].getLeftX
            let rightBorder = leftBorder + cellWidth
            let bottomBorder = board[i][j].getBottomY;
            let topBorder = bottomBorder - cellHeight

            if ((xCoord > leftBorder && xCoord < rightBorder) && (yCoord > topBorder && yCoord < bottomBorder)) {
                return board[i][j].id
            }// if
        }// inner loop
    }// outer loop
    return this.finalPos;
}// findCell

/*BOARD 1*/
// Locations of ladders
export const ladders = new Map([["03", "55"], ["11", "49"], ["13", "54"], ["21", "57"], ["40", "78"], ["53", "87"]])
Object.freeze(ladders);
// Locations of snakes
export const snakes = new Map([["36", "02"], ["27", "09"], ["46", "15"], ["74", "31"], ["93", "70"], ["95", "41"]])
Object.freeze(snakes);

/* BOARD 2*/
// Locations of ladders
const ladders2 = new Map([["01", "17"], ["10", "30"], ["11", "27"], ["21", "39"], ["35", "61"], ["40", "58"], ["45", "54"], ["69", "93"], ["76", "83"], ["84", "96"]]);
Object.freeze(ladders2);
// Locations of snakes
const snakes2 = new Map([["20", "14"], ["22", "05"], ["28", "14"], ["34", "17"], ["46", "31"], ["51", "37"], ["70", "33"], ["81", "58"], ["94", "77"], ["98", "78"]]);
Object.freeze(snakes2);

/* BOARD 3 */
// Locations of ladders
const ladders3 = new Map([["01", "44"], ["03", "26"], ["08", "30"], ["46", "83"], ["69", "86"], ["70", "90"]]);
Object.freeze(ladders3);
// Locations of snakes
const snakes3 = new Map([["15", "07"], ["51", "27"], ["77", "24"], ["92", "88"], ["94", "74"], ["98", "20"]]);
Object.freeze(snakes3);

/* BOARD 4, 5 */
// Locations of ladders
const ladders4 = new Map([["07", "28"], ["21", "60"], ["53", "67"], ["64", "96"], ["71", "92"]]);
Object.freeze(ladders4);
// Locations of snakes
const snakes4 = new Map([["22", "16"], ["44", "04"], ["51", "32"], ["66", "27"], ["89", "49"], ["98", "23"]]);
Object.freeze(snakes4);

// GAME
export default class Game {
    constructor(scene, gameState) {
        this.scene = scene;
        // Initialize the game state
        this.state = JSON.parse(gameState);
        this.numCorrectMoves = this.state.correct;
        this.numOfMoves = this.state.numOfMoves;
        this.roundNum = this.state.round; // current game round number
        
        this.isGameOver = this.state.gameOver;
        this.currentTime = this.state.time;
        this.totalTime = this.state.totalTime;
    }
    
    /**
     * Returns the game's current statua
     */
    get gameover() {
        return this.isGameOver;
    }

    /**
    * Initialize the game board state
    */
    init() {
        // Sets and display initial score
        this.scoreTotal = this.state.score
        this.scene.scoreText.text = `SCORE: ${this.scoreTotal}`;
        // Display the initial time
        this.scene.timeText.text = `TIME: ${this.currentTime}`;
        this.correctPos = parseInt(this.state.index); // index of correct cell choice
        this.finalPos = this.state.index; // player's final correct position on the board
        this.difficulty = this.state.difficulty; // game mode
    }// init

    /**
    * Returns player position on game board
    * @return {string} player's position
    */
    get playerPosition() {
        return this.state.index;
    }// playerPosition

    /**
    * Returns the current time
    */
    get counter() {
        return this.currentTime;
    }

    /**
    * Initializes the time counter
    * @param {number} time the initial time
    */
    set counter(time) {
        this.currentTime = time;
    }

    /**
    * Returns the round number
    */
    get round() {
        return this.roundNum;
    }

    /**
    * Returns the final position
    */
    get finalPosition() {
        return this.finalPos;
    }

    /* Gets the player click coordinates */
    getMousePos(x, y, board) {
        const playerIndex = findCell(cells, x, y, board.displayWidth / 10, board.displayHeight / 10);
        this.movePlayer(playerIndex);
    }

    /* Determines whether player  landed on a snake or a ladder */
    checkSnakesLadders(choiceIndex) {
        this.scoreTotal += 200;
        this.state.score = this.scoreTotal
        let _ladders;
        let _snakes;
        
        // Select correct game board
        if (this.roundNum == 1) {
            _ladders = ladders;
            _snakes = snakes;
        } else if (this.roundNum == 2) {
            _ladders = ladders2;
            _snakes = snakes2;
        } else if (this.roundNum == 3) {
            _ladders = ladders3;
            _snakes = snakes3;
        } else if (this.roundNum >= 4) {
            _ladders = ladders4;
            _snakes = snakes4;
        }
        
        // Move player up the ladder
        if (_ladders.get(choiceIndex) != undefined) {
            const index = _ladders.get(choiceIndex);
            this.scene.positionPlayer(parseInt(index[1]), parseInt(index[0]), this.scene.board1);
            this.finalPos = _ladders.get(choiceIndex);
            this.state.index = this.finalPos;
            this.scoreTotal += 400;
            this.state.score = this.scoreTotal
            this.scene.ladderUpSound.play();
            return true;
        }
        
        // Move player to end of tail snake
        if (_snakes.get(choiceIndex) != undefined) {
            const index = _snakes.get(choiceIndex);
            this.scene.positionPlayer(parseInt(index[1]), parseInt(index[0]), this.scene.board1);
            this.finalPos = index;
            this.scoreTotal -= 400;
            this.state.index = this.finalPos;
            this.state.score = this.scoreTotal

            this.scene.downSnakeSound.play();
            return true;
        }
        this.scene.positionPlayer(parseInt(choiceIndex[1]), parseInt(choiceIndex[0]), this.scene.board1);
        return false;
    }// checkSnakesLadders

    /**
    * Positions player on the game board
    * @param {string} choiceIndex grid cell clicked by player
    */
    movePlayer(choiceIndex) {
        if (choiceIndex == this.correctPos) {
            this.state.index = choiceIndex;
            if (this.state.isChallenge) {
                this.currentTime = 15;
            }
            /* Display a tick for correct move */
            this.finalPos = choiceIndex;
            this.scoreTotal += 200;
            if (!this.checkSnakesLadders(choiceIndex)) {
                this.scene.correctSound.play();
            }
            this.numCorrectMoves++;
            this.state.correct = this.numCorrectMoves

            this.scene.tick.setPosition(250, 40);
            this.scene.cross.setPosition(-250, 40)
        } else {
            /* Display a cross for incorrect move */
            this.scene.cross.setPosition(250, 40);
            this.scene.tick.setPosition(-250, 40);
            this.scene.incorrectSound.play();
            this.isGameOver = true;
        }
        // Display the current score
        this.scene.scoreText.text = `SCORE: ${this.scoreTotal}`;
        this.state.time = this.currentTime;
        // Store current game state
        localStorage.setItem(GAMESTATE_KEY, JSON.stringify(this.state));
    }// end movePlayer

    /**
    * Updates the total number of moves made by player
    */
    updateMoveCount() {
        this.numOfMoves++;
        this.state.numOfMoves = this.numOfMoves;
        localStorage.setItem(GAMESTATE_KEY, JSON.stringify(this.state));
    }// updateMoveCount

    /* Initializes rhe game */
    initializeGrid() {

        // Initialize board cells
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                cells[i].push(new Cell(`${i}${j}`, 0, 0));
            }
        }
        this.initBoardCells();
    }// initializeGrid

    /* Initializes the game board cells */
    initBoardCells() {
        const boardWidth = this.scene.board1.displayWidth;
        const boardHeight = this.scene.board1.displayHeight;
        const cellWidth = boardWidth / 10;
        const cellHeight = boardHeight / 10;

        const boundingRectLeft = 0;
        const boundingRectBottom = (config.height / 2) + (this.scene.board1.displayHeight / 2);

        const numOfCols = 10;
        const numOfRows = 10;
        for (let row = 0; row < numOfRows; row++) {
            let offset = 9;
            for (let col = 0; col < numOfCols; col++) {
                if (row % 2 === 1) {
                    cells[row][col].index = `${row}${offset}`;
                    offset--;
                } else {
                    cells[row][col].index = `${row}${col}`;
                }
                cells[row][col].setLeftX = boundingRectLeft + col * cellWidth

                cells[row][col].setBottomY = boundingRectBottom - (row * cellHeight);
            }// for loop
        }// for loop
    }// end of initBoardCells

    /* Calculates the final score */
    computeScore() {
        const precisionBonus = this.difficulty === "Hard"? 10000: 5000;
        const timerBonus = 100;

        if (this.numOfMoves === 0)this.numOfMoves = 1;
        const precision = Math.round(this.scoreTotal + (precisionBonus * this.numCorrectMoves / this.numOfMoves));
    
        let playTime = this.totalTime * timerBonus;
        if (this.state.isChallenge && this.numCorrectMoves >= 10)
            playTime +=  200000;
        else if(this.state.isChallenge && this.numCorrectMoves > 0)
            playTime += 1000;
        if (this.state.isChallenge && this.finalPos == 99){ playTime += 1000000;
        }
        const finalScore = Math.round(precision + playTime);
        return {
            precision,
            playTime,
            finalScore
        };
    }// computeScore

    /* Geneates the arithmetic expression that determines number and direction of moves */
    generateExp() {
        let upper,
        lower;

        if (this.state.difficulty === "Easy") {
            upper = 6;
            lower = -6;
        } else {
            upper = 12;
            lower = -12;
        }
        let num1,
        num2;
        let signOfNum1,
        signOfNum2;
        let finalPos = 0,
        playerPos = 0;
        // Randomly choose two integers
        do {
            num1 = Math.floor(Math.random() * (upper - lower + 1)) + lower;
            num2 = Math.floor(Math.random() * (upper - lower + 1)) + lower;
            finalPos = parseInt(this.finalPos) + num1 + num2;
        }while (finalPos < 0 || finalPos > 99); // end while

        this.correctPos = finalPos;
        signOfNum1 = num1 >= 0 ? " ": "";
        signOfNum2 = num2 > 0 ? "+": "-";
        this.scene.expr.text = `${signOfNum1}${num1} ${signOfNum2} ${Math.abs(num2)}`;
    }// end generateExp
}