class PlayerUi {
    constructor(scene) {
        this.scene = scene;

        this.redFilter = this.scene.add.rectangle(0, 0, 800, 600, 0xff0000).setOrigin(0, 0).setScrollFactor(0).setAlpha(0);


        this.blackFilter = scene.add.rectangle(0, 0, 800, 600, 0x000000).setOrigin(0, 0).setScrollFactor(0).setAlpha(0).setDepth(2);
        this.gameoverUi =  scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY-scene.cameras.main.centerX/3, 'GAMEOVER', { fontFamily: 'Pixelify Sans', fontSize: '70px', color: '#ce0505' }).setScrollFactor(0).setAlpha(0).setDepth(2).setOrigin(0.5, 0.5);

        this.endText = this.scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY-scene.cameras.main.centerX/4, '00:00', {
            fontFamily: 'Pixelify Sans',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0).setScrollFactor(0).setAlpha(0).setDepth(2);


        this.restartButton = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY , 'Restart', { fontFamily: 'Pixelify Sans',fontSize: '28px', fill: '#ffffff' }).setScrollFactor(0).setOrigin(0.5, 0.5).setDepth(2).setAlpha(0);

        this.greenFilter = scene.add.rectangle(0, 0, 800, 600, 0x00ff00).setOrigin(0, 0).setScrollFactor(0).setAlpha(0).setDepth(2);

        this.blagueText = scene.add.text(scene.cameras.main.centerX, scene.cameras.main.centerY, 'Instant blagues', {
            fontFamily: 'Pixelify Sans',
            fontSize: '60px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5).setAlpha(0).setScrollFactor(0).setDepth(2);

        this.timerText = scene.add.text(scene.cameras.main.centerX, 10, '00:00', {
            fontFamily: 'Pixelify Sans',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1);


        this.startTime = Date.now();
        this.timerEvent = scene.time.addEvent({
            delay: 1000, // se déclenche toutes les 1000ms (1 seconde)
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
    updateTimer() {
        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        this.timerText.setText(this.formatTime(minutes, seconds) );
    }

    formatTime(minutes, seconds) {
        return [minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
    }
    gameover(){
        this.blackFilter.setAlpha(0.5)
        this.gameoverUi.setAlpha(1)
        this.timerEvent.remove(false);
        this.timerEvent = null;
        this.endText.setText(this.timerText.text).setAlpha(1);
        this.restartButton.setAlpha(1)
        this.restartButton.setInteractive()
        this.restartButton.on('pointerdown', this.restart);

    }
    restart(){
        window.location.reload()
    }

    hitUi(){
        this.scene.cameras.main.shake(200, 0.005);
        this.redFilter.setAlpha(0.5);
        this.scene.time.delayedCall(100, () => {
            this.redFilter.setAlpha(0);
        });
    }
    blagueTime(active){
        this.greenFilter.setAlpha(active?.4:0)
        this.blagueText.setAlpha(active?1:0)

        this.scene.music.setVolume(active?0.1:0.3);

    }

}
