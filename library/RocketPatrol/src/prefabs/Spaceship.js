// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, name, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);   // add to existing scene
        
        this.name = name;
        this.scene = scene;
        this.gizmos = new Gizmos(this.scene);

        // active position
        this.x = Math.floor(x);
        this.y = Math.floor(y);

        // start position
        this.startX = this.x;
        this.startY = this.y;

        // start scale / rotation
        this.setScale(2);
        this.setAngle(-90);

        // speed
        this.moveSpeed = 20;
    
        // spawn range
        this.spawnRange =  50; 

        // death state
        this.dead = false;

        // spaceship fly animation config
        this.anims.create({
            key: 'spaceship_fly',
            frames: this.anims.generateFrameNumbers('spaceship_fly', { 
                start: 0, 
                end: 2, 
                first: 0
            }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.play('spaceship_fly');  // play fly animation

        // create name text
        this.gizmos.nameText = this.gizmos.createText(this.x, this.y + this.height, this.name, 10, 15)


        //console.log(this.startX, this.startX - screen.width, this.startY, this.spawnRange, color_pal.toInt("pink"));
    }

    update() {

        // update name text
        this.gizmos.updateText(this.gizmos.nameText, this.x, this.y + this.height, this.name, 10, 15)

        // show spawn range
        this.gizmos.horzlineRange(this.startX - screen.width, this.startX, this.startY, this.spawnRange, color_pal.toInt("pink"));

        // move spaceship left
        this.x -= this.moveSpeed;

        // 'kill' spaceship once hits right edge
        if(this.x <= 0 && !this.dead) {
            
            this.dead = true;
            this.reset();
        }
    }

    // position reset
    reset() {

        // disable
        this.setActive(false);
        this.setVisible(false);

        // get random height inside spawn range
        let min = - this.spawnRange / 2;
        let max = this.spawnRange;
        let randomHeight = Math.floor(Math.random() * (max - min + 1)) + min;

        // add random height to start spawn
        this.x = this.startX;
        this.y = this.startY + randomHeight;

        // enable
        this.setActive(true);
        this.setVisible(true);

        this.dead = false;
    }
}
