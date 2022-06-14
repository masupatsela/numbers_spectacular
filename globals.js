/*!
@author Teboho Thabo Thage
@version 1.0.00

@Copyright (c) 2022, Teboho Thabo Thage
*/

"use strict"; 

import Game from "./game.js"
import Menu from "./menu.js"
import Level from "./level.js"
import Results from "./results.js"
import Register from "./register.js"
import Scores from "./high_scores.js"
import Challenge from "./challenge.js"

export const config = {
    type: Phaser.AUTO,
    width: 344,
    height: 491,
    scene: [Game, Menu, Level, Results, Register, Scores, Challenge]
};
export const difficulty = { mode : "Easy"};

export const sounds = [
"sound/correctSound.mp3",
"sound/app_src_main_res_raw_incorrect.mp3", "sound/app_src_main_res_raw_metalgong.mp3",                              "sound/intro.mp3",                   "sound/app_src_main_res_raw_snake.mp3", "sound/mixkit-sad-game-over-trombone-471.wav",                              "sound/mixkit-game-over-dark-orchestra-633.wav"]				
Object.freeze(sounds)

export const gameState = {
  difficulty: "Easy",
  gameOver: false,
  score: 0, 
  time: 300,
  index: "00", // player's latest position on the board
  correct: 0, // correct number of moves made by player
  numOfMoves: 0, // total number of moves made by player
  round: 1,
  totalTime: 0,
  isChallenge: false
 }
 
Object.freeze(gameState);
 
export const GAMESTATE_KEY = "gameState";
export const HIGH_SCORES_KEY = "highScores";
 
export const gameResults = {precision : 0, playTime: 0, finalScore: 0};// player's computed final results
 
export const recordedScores = [{name: "AAA", score: 5000}, {name: "BBB", score: 4000}, {name: "CCC", score: 3000}, {name: "DDD", score: 2000}, {name: "EEE", score: 1000}]



 
 