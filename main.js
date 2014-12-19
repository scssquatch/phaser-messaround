var bootState = {
  preload: function() {
    game.load.image('progressBar', 'assets/progressBar.png');
  },

  create: function () {
    game.stage.backgroundColor = '#3498db';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.state.start('load');
  }
}

var loadState = {
  preload: function () {
    var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
                                     { font: '30px Arial', fill: '#ffffff' });
    loadingLabel.anchor.setTo(0.5, 0.5);

    var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);

    game.load.image('player', 'assets/player.png');
    game.load.image('wallV', 'assets/wallVertical.png');
    game.load.image('wallH', 'assets/wallHorizontal.png');
    game.load.image('coin', 'assets/coin.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('background', 'assets/background.png');
  },

  create: function() {
    game.state.start('menu');
  },
}

var menuState = {
  preload: function () {
    game.add.image(0, 0, 'background');

    var nameLabel = game.add.text(game.world.centerX, 80, 'Super Coin Box',
                                  { font: '50px Arial', fill: '#ffffff' });
    nameLabel.anchor.setTo(0.5, 0.5);

    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY,
                                   'score: ' + game.global.score,
                                   { font: '25px Arial', fill: '#ffffff' });
    scoreLabel.anchor.setTo(0.5, 0.5);

    var startLabel = game.add.text(game.world.centerX, game.world.height - 80,
                                   'press the up arrow key to start',
                                   { font: '25px Arial', fill: '#ffffff' });
    startLabel.anchor.setTo(0.5, 0.5);

    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

    upKey.onDown.addOnce(this.start, this);
  },

  start: function () {
    game.state.start('play');
  }
}

var playState = {
  create: function() {
    //arrow keys
    this.cursor = game.input.keyboard.createCursorKeys();

    //player
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 500;

    // enemies
    this.enemies = this.game.add.group()
    this.enemies.enableBody = true;
    this.enemies.createMultiple(10, 'enemy');

    // coin
    this.coin = game.add.sprite(60, 140, 'coin');
    game.physics.arcade.enable(this.coin);
    this.coin.anchor.setTo(0.5, 0.5);

    // score
    this.scoreLabel = game.add.text(30, 30, 'score: 0',
                                    { font: '18px Arial', fill: '#ffffff' });
    game.global.score = 0;

    //everyones ready, add world and enemies
    this.createWorld();
    game.time.events.loop(2200, this.addEnemy, this);
  },

  update: function() {
    game.physics.arcade.collide(this.player, this.walls);
    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    game.physics.arcade.collide(this.enemies, this.walls);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
    this.movePlayer();

    if (!this.player.inWorld) {
      this.playerDie();
    }
  },

  movePlayer: function () {
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -200;
    }
    else if (this.cursor.right.isDown) {
      this.player.body.velocity.x = 200;
    }
    else {
      this.player.body.velocity.x = 0;
    }

    if (this.cursor.up.isDown && this.player.body.touching.down) {
      this.player.body.velocity.y = -320;
    }
  },

  createWorld: function () {
    this.walls = game.add.group();
    this.walls.enableBody = true;

    game.add.sprite(0, 0, "wallV", 0, this.walls); //Left
    game.add.sprite(480, 0, "wallV", 0, this.walls); //Right
    game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
    game.add.sprite(300, 0, 'wallH', 0, this.walls); // Top right
    game.add.sprite(0, 320, 'wallH', 0, this.walls); // Bottom left
    game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
    game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
    game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right

    var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls); //middle top
    middleTop.scale.setTo(1.5, 1);

    var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls); //middle bottom
    middleBottom.scale.setTo(1.5, 1);

    this.walls.setAll('body.immovable', true);
  },

  playerDie: function () {
    game.state.start('menu');
  },

  takeCoin: function (player, coin) {
    game.global.score += 5;
    this.scoreLabel.text = 'score: ' + game.global.score;
    this.updateCoinPosition();
  },

  updateCoinPosition: function() {
    var coinPositions = [
      {x: 140, y: 60}, {x: 360, y: 60}, // Top row
      {x: 60, y: 140}, {x: 440, y: 140}, // Middle row
      {x: 130, y: 300}, {x: 370, y: 300} // Bottom row
    ]

    for (var i = 0; i < coinPositions.length; i++) {
      if (coinPositions[i].x === this.coin.x) {
        coinPositions.splice(i, 1);
      }
    }

    var newPosition = coinPositions[game.rnd.integerInRange(0, coinPositions.length-1)];

    this.coin.reset(newPosition.x, newPosition.y);
  },

  addEnemy: function() {
    var enemy = this.enemies.getFirstDead();

    if(!enemy) {
      return;
    }

    enemy.anchor.setTo(0.5, 1);
    enemy.reset(game.world.centerX, 0);
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
    enemy.body.bounce.x = 1;
    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;
  }
};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');

//set global score
game.global = { score: 0 };

//add states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');
