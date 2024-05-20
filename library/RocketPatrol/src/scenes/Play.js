class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {

        this.Gizmos = new Gizmos(this);

        // load images/tile sprites
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('rocket_fire', './assets/rocket.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 1});

        this.load.spritesheet('spaceship_fly', './assets/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 2});
        this.load.spritesheet('spaceship_roll', './assets/spaceship_fly_roll.png', {frameWidth: 32, frameHeight: 32, startFrame: 3, endFrame: 9});

    }

    create() {

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket_fire').setOrigin(0.5);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, "ship1", game.config.width, game.config.height * 0.25, 'spaceship', 0, 20);        
        this.ship02 = new Spaceship(this, "ship2", game.config.width, game.config.height * 0.50, 'spaceship', 0, 20);
        this.ship03 = new Spaceship(this, "ship3", game.config.width, game.config.height * 0.75, 'spaceship', 0, 20);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // explode animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { 
                start: 0, 
                end: 9, 
                first: 0
            }),
            frameRate: 30
        });

        //#region  >>>>> GAME UI 
        // initialize score
        this.p1Score = 0;

        // display score
        let headerConfig = {
            fontFamily: 'Courier New',
            fontSize: '30px',
            backgroundColor: color_pal.black,
            color: color_pal.white,
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
                left: 5,
                right: 5
            },
            fixedWidth: 100
        }

        // score value
        this.scoreValueText = this.add.text(game.config.width/4 - (borderUISize + borderPadding), borderUISize, this.p1Score, headerConfig).setOrigin(0.5,0.5);

        // time passed
        this.timePassedText = this.add.text( (game.config.width*0.75) + (borderUISize + borderPadding), borderUISize, 'Time Passed', headerConfig).setOrigin(0.5,0.5);

        // title
        headerConfig.fixedWidth = 0;
        this.titleText = this.add.text(game.config.width/2, borderUISize, "Rocket Patrol", headerConfig).setOrigin(0.5,0.5);
        //#endregion

        //#region  >>>>> GAME TIMER
        // GAME OVER flag
        this.gameOver = false;

        // << SETUP TIMER >>
        this.gameTimer = this.time.addEvent({
            delay: 60000, // 60 seconds in milliseconds
            callback: function(){
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', headerConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', headerConfig).setOrigin(0.5);
                this.gameOver = true;
            },
            callbackScope: this,
            loop: false
        });
        //#endregion
    }

    update() {

        // >> {{ ALWAYS CLEAR GRAPHICS FIRST }} //
        this.Gizmos.graphics.clear();

        // >> LINE RANGE GIZMO :: [ scene , startpoint, endpoint, width, height, rotation, horzLine, vertLine ]
        var startpoint =  { x: screen.leftMid.x, y: screen.leftMid.y };
        var endpoint = { x: screen.rightMid.x, y: screen.rightMid.y };

        //this.Gizmos.horzlineRange(startpoint.x, endpoint.x, startpoint.y, 50);
        //this.Gizmos.vertlineRange(screen.botMid.x, screen.botMid.y, screen.topMid.y, 50);
        //this.Gizmos.diagonalLineRange(0, 0, screen.botRight.x, screen.botRight.y);

        //#region  >>>>> UI UPDATE 
        // << UPDATE CLOCK UI >>
        if (!this.gameOver) {
            const timePassed = Math.floor(this.gameTimer.getElapsedSeconds());
            this.timePassedText.setText(`${timePassed}/60`);
        }

        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        //#endregion

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
        }

        // << ROCKET COLLISIONS >>
        if (!this.ship01.dead && this.checkCollision(this.p1Rocket, this.ship01))
        {
            this.shipExplode(this.ship01);
            this.p1Rocket.reset();
        }
        if (!this.ship01.dead && this.checkCollision(this.p1Rocket, this.ship02))
        {
            this.shipExplode(this.ship02);
            this.p1Rocket.reset();
        }
        if (!this.ship01.dead && this.checkCollision(this.p1Rocket, this.ship03))
        {
            this.shipExplode(this.ship03);
            this.p1Rocket.reset();
        }

    }

    checkCollision(objectA, objectB) {
        // simple AABB checking
        if (objectA.x < objectB.x + objectB.width && 
            objectA.x + objectA.width > objectB.x && 
            objectA.y < objectB.y + objectB.height &&
            objectA.height + objectA.y > objectB. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;  
        ship.dead = true;

        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });

        // score add and repaint
        this.p1Score += ship.points;
        this.scoreValueText.text = this.p1Score; 
        
        //this.sound.play('sfx_explosion');
      }
    
}