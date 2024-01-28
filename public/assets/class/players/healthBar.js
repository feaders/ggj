class HealthBar {
    constructor(scene, x, y, maxHealth) {
        this.scene = scene;
        this.hearts = [];


        for (let i = 0; i < Math.ceil(maxHealth/2); i++) {
            let heart = scene.add.sprite(x - i * 44, y, 'heartDisplay').setScrollFactor(0).setDisplaySize(40, 40).setOrigin(0, 0.5).setDepth(1);
            heart.flipX = true
            this.hearts.push(heart);
        }
        this.updateHealth(maxHealth)
    }

    updateHealth(newHealth) {
        this.currentHealth = newHealth;

        for (let i = 0; i < this.hearts.length; i++) {
            let frameIndex;
            if (newHealth >= (i + 1) * 2) {
                frameIndex = 0; // Cœur plein
            } else if (newHealth >= (i * 2) + 1) {
                frameIndex = 2; // Cœur à moitié plein
            } else {
                frameIndex = 1; // Cœur vide
            }
            this.hearts[i].setFrame(frameIndex);
        }
    }
}
