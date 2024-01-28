class Mob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.textureMob = texture
        this.minDistance = 50
        // Ajoutez le mob à la scène
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const width = 24, height = 46
        const offsetX = 20, offsetY = 18

        this.body.setSize(width, height);
        this.body.setOffset(offsetX, offsetY);

        this.speed = 100; // Vitesse de déplacement du mob

        this.createAnimations(scene, texture);

        this.health =100// Points de vie du mob
        this.isDead=false;

        this.collisionDistance = 250

        this.deathSound = scene.sound.add('death');


    }

    update(target, mobs) {
        // Ciblez le joueur le plus proche ou une cible spécifiée
        if (target && !this.isDead) {
            this.moveTowardsPlayer(target, mobs);
        }
    }
    createAnimations(scene, texture) {
        // Animation marche vers le haut
        scene.anims.create({
            key: 'walkUp'+texture,
            frames: scene.anims.generateFrameNumbers(texture, { frames: [104, 105, 106, 107, 108, 109, 110, 111, 112] }),
            frameRate: 8,
            repeat: -1
        });

        // Animation marche vers la gauche
        scene.anims.create({
            key: 'walkLeft'+texture,
            frames: scene.anims.generateFrameNumbers(texture, { frames: [117, 118, 119, 120, 121, 122, 123, 124, 125] }),
            frameRate: 8,
            repeat: -1
        });

        // Animation marche vers le bas
        scene.anims.create({
            key: 'walkDown'+texture,
            frames: scene.anims.generateFrameNumbers(texture, { frames: [130, 131, 132, 133, 134, 135, 136, 137, 138] }),
            frameRate: 8,
            repeat: -1
        });

        // Animation marche vers la droite
        scene.anims.create({
            key: 'walkRight'+texture,
            frames: scene.anims.generateFrameNumbers(texture, { frames: [143, 144, 145, 146, 147, 148, 149, 150, 151] }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'dead'+texture,
            frames: scene.anims.generateFrameNumbers(texture, { start:260, end:265 }),
            frameRate: 8,
            repeat: 0
        });
    }


    moveTowardsPlayer(target, mobs) {
        const dist = Phaser.Math.Distance.Between(target.x, target.y, this.x, this.y);
        if(dist <= this.minDistance ){
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            this.anims.stop();
            this.attack(target);
            return
        }
        // Calculez la direction vers la cible
        let angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);

        let nextX = this.x + Math.cos(angle) * this.speed;
        let nextY = this.y + Math.sin(angle) * this.speed;

        // Vérifiez la collision potentielle avec d'autres mobs
        let collision = mobs.getChildren().some(mob => {
            return mob !== this && Phaser.Math.Distance.Between(nextX, nextY, mob.x, mob.y) < this.collisionDistance;
        });

        if (collision) {
            // Ajustez l'angle pour éviter la collision
            angle += Math.PI / 4; // Ajustez l'angle de 45 degrés
        }
        // Mettez à jour la vélocité du mob
        this.body.setVelocityX(Math.cos(angle) * this.speed);
        this.body.setVelocityY(Math.sin(angle) * this.speed);

        if (Math.abs(this.body.velocity.x) > Math.abs(this.body.velocity.y)) {
            // Mouvement horizontal
            if (this.body.velocity.x < 0) {
                this.anims.play('walkLeft'+this.textureMob, true);
            } else {
                this.anims.play('walkRight'+this.textureMob, true);
            }
        } else {
            // Mouvement vertical
            if (this.body.velocity.y < 0) {
                this.anims.play('walkUp'+this.textureMob, true);
            } else {
                this.anims.play('walkDown'+this.textureMob, true);
            }
        }

    }
    hit(dammages){

        this.health -= dammages

        if(this.health<=0){
            this.isDead=true;
            this.body.setEnable(false);
            this.body.setVelocityX(0);
            this.body.setVelocityY(0);
            this.anims.play('dead'+this.textureMob, true);

            new Carambar(this.scene, this.x, this.y);
            this.deathSound.play()


            this.scene.time.delayedCall(8000, () => {
                this.destroy();
            });
        }

    }
    attack(target){
        target.hit(1)

    }
}
