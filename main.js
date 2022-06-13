export const config = {
  type: Phaser.AUTO,
  width: 344,
  height: 491,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 200
      },
      debug: true
    }
 }
 scene: [Game]
}

new Phaser.Game(config)


