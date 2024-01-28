class MobSpawner {
    constructor(scene, mobKey, spawnInterval, mobGroup, maxMobs) {
        this.scene = scene;
        this.mobKey = mobKey;
        this.spawnInterval = spawnInterval;
        this.maxMobs = maxMobs;
        this.mobs = mobGroup;
        this.timer = this.scene.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnMob,
            callbackScope: this,
            loop: true
        });
    }

    spawnMob() {
        if (this.mobs.getChildren().length < this.maxMobs) {
            // Créez et configurez votre mob ici
            const x = Phaser.Math.Between(0,4000);
            const y = Phaser.Math.Between(0,4000);
            const mob = new Mob(this.scene, x, y, this.mobKey);

            this.mobs.add(mob);
        }
    }

    // Méthode pour arrêter le spawner si nécessaire
    stop() {
        this.timer.remove();
    }
}
