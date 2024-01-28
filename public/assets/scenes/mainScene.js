
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.spritesheet('char1', 'assets/images/characters/char1.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('mob', 'assets/images/characters/mob.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('uwu', 'assets/images/characters/UWU.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('manaSpell', 'assets/images/spells/mana.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('map', 'assets/images/maps/GGJMap.png');
        this.load.spritesheet('heartDisplay', 'assets/images/characters/heartDisplay.png', {frameWidth: 96, frameHeight: 96});
        this.load.image('cbar', 'assets/images/props/CarambarPixel.png');

        this.load.audio('music', 'assets/audio/KazouGameMusic.m4a');
        this.load.audio('death', 'assets/audio/MortRayou.m4a');
        this.load.audio('shoot', 'assets/audio/Shooting.m4a');

        for (let i = 1; i <= 7; i++) {
            this.load.audio('carambarAudio' + i, 'assets/audio/blagues/blague' + i + '.m4a');
        }

    }

    create() {

        this.music = this.sound.add('music', { loop: true });
        this.music.setVolume(0.3);
        this.music.play()


        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const map =  this.add.image(-400, -300, 'map', '__BASE').setOrigin(0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.mobs = this.physics.add.group({
            classType: Mob,
            //runChildUpdate: true // Cela permet d'appeler la méthode 'update' pour chaque mob
        });
        this.projectiles = this.physics.add.group({
            classType: Projectile,
        });


        this.player = new Player(this, 960, 750, 'char1',this.cursors, this.projectiles);


        this.mobSpawner = new MobSpawner(this, 'mob', 4000, this.mobs, 30)



        this.physics.add.collider(this.player, this.mobs, null, null, this);
        this.physics.add.collider(this.mobs, this.mobs, function(mob1, mob2) {
                // Vous pouvez ajouter une logique de collision personnalisée ici si nécessaire
        });
        this.physics.add.collider(this.projectiles, this.mobs, function(proj, mob) {

            mob.hit(proj.dammages)

            proj.destroy()
        });

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        this.player.update(this.cursors,  this.spaceKey);
        this.mobs.getChildren().forEach(mob=>{
            mob.update(this.player, this.mobs)
        })
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}
