import {gameState, GAMESTATE_KEY} from "./globals.js"

/*Holds start and end times between game start and player click*/
const delta = {
    startTime: 0,
    endTime: 0,
    startRecorded: false,
    endRecorded: true
};

export default class BonusStage extends Phaser.Scene {
    constructor() {
        super("bonus");
    }

    init() {
        this.gameStarted = false;
        this.score = 0; //number of correct taps oe clicks
        this.counter = 20; //remaining time counter
        //Game world border locations
        this.LEFT_WALL_X = 0;
        this.RIGHT_WALL_X = 344;
        this.TOP_WALL_Y = 0;
        this.BOTTOM_WALL_Y = 491;

        this.labels = []; //labels on square and rectangular frames
        this.floatNumbers = []; //physics enabled frames
        this.GUIdepth = {
            bottom: 0,
            middle: 1,
            top: 2
        };
    }//init

    preload() {
        this.load.image("bonusStage", "img/bg_bonus_stage.png");

    }//preload

    create() {
        const bg = this.add.image(0, 0, "bonusStage");
        bg.depth = this.GUIdepth.bottom;

        this.choice = Math.floor(Math.random() * 10);
        this.createNumberFrames();
        this.floatNumbers.forEach(num => {
            num.body.gravity.y = 0;
            num.setActive(false).setVisible(false);
        });

        this.bonusText = this.add.text(35, 170, "Bonus Stage", {
            fontFamily: "no_continue",
            fontSize: 50,
            color: "#ff0000"}
        );
            this.bonusText.depth = this.GUIdepth.middle;

            this.exprText = this.add.text(60, 20, `+(${this.num1}) + (${this.num2}) = ?`,
                {
                    fontFamily: "Monaco, Courier, monospace", fontSize: "25px", fill: "#FFF"
                }); //puzzle to be solved
            this.exprText.depth = this.GUIdepth.bottom;
            this.exprText.setActive(false).setVisible(false);

            this.instruct = this.add.text(30, 200, "TAP CORRECT NUMBER!", {
                fontFamily: "Monaco, Courier, monospace", fontSize: "25px", fill: "#FF0000"
            }); //bonus stage instruction
            this.instruct.setScale(1, 2);
            this.instruct.setActive(false).setVisible(false);

            this.addFinalMessage();
            //Timer
            this.timeText = this.add.text(270, 420, `${this.counter}`, {
                fontFamily: 'monospace', fontSize: 30, backgroundColor: '#fff', color: "#ff0000"
            });
            this.timeText.alpha = 0.5;
            this.timeText.setScale(1, 1.5);

            let startTimedEvent = this.time.addEvent({
                delay: 2000, callback: this.startBonusRound, callbackScope: this, loop: false
            }); //trigger bonus stage start

            // Start the timer
            let timedEvent2 = this.time.addEvent({
                delay: 2000, callback: this.decreaseTimer, callbackScope: this, loop: true
            });
            // Return to the game
            const timedEvent3 = this.time.addEvent({
                delay: 46000, callback: this.nextStage, callbackScope: this, loop: false
            });
        }//create

        generateNumbers() {
            const s = new Set();
            const map = new Map();

            do {
                const num1 = Math.floor(Math.random() * 13 - 6);
                const num2 = Math.floor(Math.random() * 13 - 6);
                const sum = num1 + num2
                const size = s.size;
                s.add(sum);

                if (s.size != size)
                    map.set(sum, {
                    num1, num2
                });
            }while (s.size < 10);

            return {
                map,
                s
            };
        }//generateNumbers

        update(t, dt) {
            if (delta.startRecorded) {
                delta.startRecorded = false;
                delta.endRecorded = false;
                delta.startTime = t / 1000;
            }

            if (delta.endTime > (delta.startTime + 1) && !delta.endRecorded) {
                delta.endRecorded = true;
                this.restart();
            }//if

            if (this.gameStarted) {
                //Check for collision between number frame and stage borders
                this.floatNumbers.forEach(num => {
                    this.hitWalls(num);
                });
            }//if
            delta.endTime = t / 1000;
        }//update

        initFrame(index) {
            const x1 = Math.floor(Math.random() * 298 + 10);
            const y1 = Math.floor(Math.random() * 447 + 10);

            return {
                x1,
                y1
            };
        }//initFrame

        setVelocity(block) {
            const sign = Math.floor(Math.random() * 2);
            const sign2 = Math.floor(Math.random() * 2);
            const x = sign == 0 ? 150: -150;
            const y = sign2 == 0 ? 150: -150;

            block.body.gravity.y = 10;
            block.body.setVelocityX(x);
            block.body.setVelocityY(y);
        }//setVelocity

        createNumberFrames() {
            const colors = [/*red*/ '#FF0000',
                /*green*/ "#00FF00",
                /*blue*/ "#0000FF",
                /*gold*/ "#FFD700",
                /*yellow*/ "#FFFF00",
                /*fuchsia*/ "#FF00FF",
                /*lavender*/ "#E6E6FA",
                /*sky blue*/ "#87CEEB",
                /*misty rose*/ "#FFE4E1",
                /*lawn green*/ "#7CFC00"];

            const {
                map,
                s
            } = this.generateNumbers();
            const keys = [...s.values()];
            this.answer = keys[this.choice];
            this.num1 = map.get(keys[this.choice]).num1;
            this.num2 = map.get(keys[this.choice]).num2;

            let startTime = 0;
            for (let i = 0; i < 10; i++) {
                const {
                    x1,
                    y1,
                    text
                } = this.initFrame(i);
                const num = this.add.text(x1, y1, `${keys[i]}`, {
                    fill: "#000", fontFamily: "Monaco, Courier, monospace", fontSize: "30px", backgroundColor: colors[i]
                });
                num.depth = this.GUIdepth.top;

                num.setInteractive();
                num.on("pointerdown", (e) => {
                    if (num.text == this.answer) {
                        this.gameStarted = false;
                        delta.startRecorded = true;
                        this.score = this.score + 1;
                        this.instruct.destroy();
                        
                        this.floatNumbers.forEach(num => {
                            num.setActive(false).setVisible(false);
                            num.body.stop();
                            num.body.gravity.y = 0;
                        });
                    }//if
                });
                this.labels.push(num);
                this.number = this.physics.add.existing(num);
                this.setVelocity(this.number);
                this.floatNumbers.push(this.number);
            }//for
        }//createNumberFrames

        hitWalls(num) {
            if ((num.y + num.displayHeight) > this.BOTTOM_WALL_Y) {
                num.body.setVelocityY(-150);
            } else if (num.y < this.TOP_WALL_Y) {
                num.body.setVelocityY(150);
            }

            if ((num.x + num.displayWidth) > this.RIGHT_WALL_X) {
                num.body.setVelocityX(-150);
            } else if (num.x < this.LEFT_WALL_X) {
                num.body.setVelocityX(150);
            }
        }//end hitWalls

        startBonusRound() {
            this.bonusText.destroy();
            this.exprText.setActive(true).setVisible(true);
            this.instruct.setActive(true).setVisible(true);

            this.floatNumbers.forEach(num => {
                num.body.gravity.y = 10;
                num.setActive(true).setVisible(true);
            });
            this.gameStarted = true;
        }//startBonusRound

        addFinalMessage() {
            this.scoreText = this.add.text(70, 100, `Score ${this.score} hits`, {
                fontSize: 30, fontWeight: "bold", color: "#fff"
            });
            this.scoreText.setActive(false).setVisible(false);//Hide the score

            this.congratsText = this.add.text(60, 150, "CONGRATULATIONS!", {
                fontSize: 25, color: "#00ff00"
            });
            this.congratsText.depth = this.GUIdepth.middle;
            this.congratsText.setActive(false).setVisible(false);//Hide the congratulations message

            this.messageText = this.add.text(40, 180, "You have unlocked more\n game time and 10000pts", {
                fontSize: 20, color: "#ffff00"
            });
            this.messageText.depth = this.GUIdepth.middle;
            this.messageText.setActive(false).setVisible(false);//Hide the reward message
        }//addFinalMessage

        restart() {
            const {
                map,
                s
            } = this.generateNumbers();
            const keys = [...s.values()];
            
            this.choice = Math.floor(Math.random() * 10);
            this.answer = keys[this.choice];
            this.num1 = map.get(keys[this.choice]).num1;
            this.num2 = map.get(keys[this.choice]).num2;
            this.exprText.text =
            `+(${this.num1}) + (${this.num2}) = ?`;
            //Assign a number to each block
            this.labels.forEach((block, index) => {
                block.text = keys[index];
            });
            //Hide the number frames
            this.floatNumbers.forEach(num => {
                this.setVelocity(num);
                num.setActive(true).setVisible(true);
            });
            //Start the game
            this.gameStarted = true;
        }//restart

        showCongratsMessage() {
            this.congratsText.setVisible(true);
            this.scoreText.setActive(true).setVisible(true);
            this.scoreText.text = `Score: ${this.score} hits`;

            this.messageText.setVisible(true);
            
            let myScore = this.score * 1000;
            let time = 0;
            if (this.score >= 5) {
                this.messageText.text = `You have unlocked more\n game time and ${myScore}pts`;
                time = 30;
            } else {
                this.congratsText.text = "";
                this.messageText.text = `You have earned  ${myScore}pts`
            }
          const state = JSON.parse(localStorage.getItem(GAMESTATE_KEY));
         
           console.log(`score: ${myScore}, statescore: ${state.score}`);
           
           state.score += myScore;
           state.time += time;
           localStorage.setItem(GAMESTATE_KEY, JSON.stringify(state));
        }//showCongratsMessage

        /**
        * Decreases the timer
        */
        decreaseTimer() {
            //End bonus stage when timer reaches zero
            console.log(`Counter: ${this.counter}`);
            if(this.counter < 0)return;
            if (this.counter === 0) {
                this.gameStarted = false;
                this.exprText.destroy();
                this.instruct.destroy();
                this.floatNumbers.forEach(num => {
                    num.destroy();
                });

                this.showCongratsMessage();
            }
            this.counter -= 1;
            if(this.counter >= 0)this.timeText.text = `${this.counter}`;
        }// decreaseTimer
        
        nextStage(){
            this.scene.start("level");
        }// nextStage
    }