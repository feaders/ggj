class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, size, dammages) {
        super(scene, x, y, texture);

        this.createAnimations(scene, texture);

        this.dammages = dammages
        // Ajoutez le joueur à la scène
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 300
        this.setDisplaySize(size, size);


        this.anims.play('move', true);
        this.scene.time.delayedCall(5000, () => {
            this.destroy();
        });
    }
    move(dirX, dirY){
        this.setVelocityX(dirX *this.speed);
        this.setVelocityY(-dirY *this.speed);
        const angle = Math.atan2(-dirY, dirX);
        this.setRotation(angle+90);

    }

    createAnimations(scene, texture) {
        // Animation marche vers le haut
        scene.anims.create({
            key: 'move',
            frames: scene.anims.generateFrameNumbers(texture, { start:0, end:2 }),
            frameRate: 8,
            repeat: -1
        });
    }
}
