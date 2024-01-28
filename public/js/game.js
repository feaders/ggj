
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade', // Active le système de physique Arcade
        arcade: {
            gravity: { y: 0 }, // Configure la gravité, si nécessaire
            debug: false,
        }
    },
    parent: 'gameContainer',
    scene: [MainScene] // Ajoutez votre scène ici,
};
const game = new Phaser.Game(config);
