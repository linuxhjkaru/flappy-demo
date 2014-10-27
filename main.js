var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

var mainState = {

    preload: function() {

        game.load.image('bird', 'assets/bird.jpg');
        game.load.image('pipe', 'assets/pipe.jpg');
        game.load.image('pipe2', 'assets/pipe2.jpg');
        game.load.image('background', 'assets/background.png');
        game.load.image('beach', 'assets/beach.png');
    },

    create: function() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.bg= this.game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('background').height, 'background');
        this.ground = this.game.add.tileSprite(0, 420, 400, 100, 'beach');
        this.ground.autoScroll(-200, 0);

        this.pipes = game.add.group();
        this.pipes.enableBody = true;
        this.pipes.createMultiple(100, 'pipe');
        this.timer = this.game.time.events.loop(1500, this.addRowOfPipes, this);

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;

        this.bird.anchor.setTo(-0.2, 0.5);

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.score = 0;
        this.labelScore = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restartGame();

        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
        game.physics.arcade.overlap(this.bird, this.beach, this.hitGround, null, this);

        if (this.bird.angle < 20)
            this.bird.angle += 1;
    },

    jump: function() {
        if (this.bird.alive == false)
            return;

        this.bird.body.velocity.y = -350;

        game.add.tween(this.bird).to({angle: -20}, 100).start();

        this.jumpSound.play();
    },

    hitPipe: function() {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;

        this.game.time.events.remove(this.timer);

        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
    },

    hitGround: function() {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;

        this.game.time.events.remove(this.timer);

        this.beach.forEachAlive(function(p){
            p.body.velocity.y = 0;
        }, this);
    },

    restartGame: function() {
        game.state.start('main');
    },

    addOnePipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();

        pipe.reset(x, y);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },

    addRowOfPipes: function() {
        var hole = Math.floor(Math.random()*5)+1;

        for (var i = 0; i < 8; i++)
            if (i != hole && i != hole +1)
                this.addOnePipe(400, i*60+10);

        this.score += 1;
        this.labelScore.text = this.score;
    },
};

game.state.add('main', mainState);
game.state.start('main');