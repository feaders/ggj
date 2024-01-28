class Carambar extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'cbar'); // Remplacez 'carambarTexture' par votre texture

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setDisplaySize(50, 50);


        // Choisir un fichier audio au hasard
        const audioKey = 'carambarAudio' + Phaser.Math.Between(1, 7);
        this.audio = this.scene.sound.add(audioKey);


        scene.physics.add.overlap(scene.player, this, function(player, cbar) {
            cbar.playAudio()
        });
    }

    playAudio() {
        this.scene.physics.pause();
        this.audio.play();
        this.scene.player.playerUi.blagueTime(true)

        this.audio.on('complete', this.resumeGame, this);
    }
    resumeGame() {
        // Reprendre le jeu
        this.scene.physics.resume();
        // Réactiver les contrôles du joueur ou d'autres éléments interactifs ici
        this.scene.player.playerUi.blagueTime(false)
        this.destroy(); // Supprime le Carambar après la fin de l'audio
    }
}
