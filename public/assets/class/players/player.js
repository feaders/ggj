class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, cursors, projectiles) {
        super(scene, x, y, texture);


        this.projectiles = projectiles
        this.speed = 160
        this.cursors = cursors
        // Ajoutez le joueur à la scène
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const width = 24, height = 46
        const offsetX = 20, offsetY = 18

        this.body.setSize(width, height);
        this.body.setOffset(offsetX, offsetY);


        this.health = 6;

        this.healthBar = new HealthBar(this.scene, 724, 50,this.health); // Crée une barre de santé avec 3 cœurs

        this.isAttacking = false

        this.createAnimations(scene, texture);

        this.attackType = "cast"
        this.attackFrame = 5

        this.isDead=false;
        this.hitCooldown=false

        this.playerUi = new PlayerUi(this.scene)

        this.shootSound = scene.sound.add('shoot');

    }

    createAnimations(scene, texture) {
        // Animation marche vers le haut
        scene.anims.create({
            key: 'walkUp',
            frames: scene.anims.generateFrameNumbers(texture, { frames: [104, 105, 106, 107, 108, 109, 110, 111, 112] }),
            frameRate: 8,
            repeat: -1
        });

        // Animation marche vers la gauche
        scene.anims.create({
            key: 'walkLeft',
            frames: scene.anims.generateFrameNumbers(texture, { frames: [117, 118, 119, 120, 121, 122, 123, 124, 125] }),
            frameRate: 8,
            repeat: -1
        });

        // Animation marche vers le bas
        scene.anims.create({
            key: 'walkDown',
            frames: scene.anims.generateFrameNumbers(texture, { frames: [130, 131, 132, 133, 134, 135, 136, 137, 138] }),
            frameRate: 8,
            repeat: -1
        });

        // Animation marche vers la droite
        scene.anims.create({
            key: 'walkRight',
            frames: scene.anims.generateFrameNumbers(texture, { frames: [143, 144, 145, 146, 147, 148, 149, 150, 151] }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'spellUp',
            frames: scene.anims.generateFrameNumbers(texture, { start : 52, end : 59 }),
            frameRate: 12,
            repeat: 0
        });

        // Animation marche vers la gauche
        scene.anims.create({
            key: 'spellLeft',
            frames: scene.anims.generateFrameNumbers(texture, { start : 65, end : 72 }),
            frameRate: 12,
            repeat: 0
        });

        // Animation marche vers le bas
        scene.anims.create({
            key: 'spellDown',
            frames: scene.anims.generateFrameNumbers(texture, { start : 78, end : 85 }),
            frameRate: 12,
            repeat: 0
        });

        // Animation marche vers la droite
        scene.anims.create({
            key: 'spellRight',
            frames: scene.anims.generateFrameNumbers(texture, { start : 91, end : 98 }),
            frameRate: 12,
            repeat: 0
        });

        scene.anims.create({
            key: 'dead',
            frames: scene.anims.generateFrameNumbers(texture, { start:260, end:265 }),
            frameRate: 8,
            repeat: 0
        });

        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'spellRight', ()=>{this.endAttack()})
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'spellDown', ()=>{this.endAttack()})
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'spellLeft', ()=>{this.endAttack()})
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + 'spellUp', ()=>{this.endAttack()})

        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (animation, frame) => {
            if (["spellRight", "spellDown", "spellLeft", "spellUp"].includes(animation.key) && frame.index === this.attackFrame) {
                this.attack();
            }
        }, this);

    }
    attack(){
        switch (this.attackType){
            case "cast":
                const spell = new Projectile(this.scene, this.x, this.y, 'manaSpell' , 15, 50)
                this.projectiles.add(spell)
                spell.move(this.lastX, this.lastY)
                this.shootSound.play()

                break;
        }
    }
    endAttack(){
        this.isAttacking = false

    }

    update(cursors, spaceKey) {
        // Gestion du mouvement du joueur
        if(this.isAttacking || this.isDead){
            this.setVelocityX(0);
            this.setVelocityY(0);
            return
        }




        let x= 0 + (cursors.right.isDown?1:0) - (cursors.left.isDown?1:0)
        let y= 0 + (cursors.up.isDown?1:0) - (cursors.down.isDown?1:0)

        if (x!==0 && y !==0){
            x/= Math.sqrt(2)
            y/= Math.sqrt(2)
        }
        if(x!==0){
            if(x<0 && y===0)
                this.anims.play('walkLeft', true);
            if(x>0 && y===0)
                this.anims.play('walkRight', true);
            this.setVelocityX(x *this.speed);

        }
        else
            this.setVelocityX(0);

        if(y!==0){
            if(y>0)
                this.anims.play('walkUp', true);
            if(y<0)
                this.anims.play('walkDown', true);
            this.setVelocityY(-y *this.speed);


        }
        else
            this.setVelocityY(0);
        if (x !== 0 || y !== 0) {
            // Mise à jour de la dernière direction si le joueur se déplace
            this.lastX = x;
            this.lastY = y;
        }





        // Arrêt de l'animation si le joueur ne bouge pas
        if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {

            this.anims.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            this.launchManaSpell();
        }

    }
    launchManaSpell() {
        if(this.isAttacking)
            return

        this.isAttacking = true

        let direction;
        if (this.lastX < 0) direction = 'Left';
        else if (this.lastX > 0) direction = 'Right';
        else if (this.lastY > 0) direction = 'Up';
        else if (this.lastY < 0) direction = 'Down';
        else direction = 'Down';
        this.anims.play(`spell${direction}`);



    }

    hit(dammages){

        if(this.hitCooldown || this.health<=0)
            return

        this.hitCooldown=true
        this.scene.time.delayedCall(500, () => {
            this.hitCooldown=false
        });

        this.health -= dammages
        this.playerUi.hitUi()
        this.healthBar.updateHealth(this.health);

        if(this.health<=0 && !this.isDead){

            this.isDead=true;
            this.body.setEnable(false);
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            this.anims.play('dead', true);
            this.playerUi.gameover()


        }

    }
}
