export const config = {
  type: Phaser.AUTO,
  width: 344,
  height: 491,
  physics: {
    default: "arcade",
    arcade: false
  },
  scene: [BonusStage]
}

export const difficulty = {mode: "Easy"}

export const sounds = []
Object.freeze(sounds)

export const gameState = {
}

export const GAMESTATE_KEY = "gameState"
export const HIGH_SCORES_KEY = "highScores"
export const gamResults = { }
export const recordedScores = {}
