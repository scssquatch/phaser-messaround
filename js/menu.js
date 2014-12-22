var menuState = {
  preload: function () {
    game.add.image(0, 0, 'background');

    // name label + tween
    var nameLabel = game.add.text(game.world.centerX, -50, 'Super Coin Box',
                                  { font: '50px Arial', fill: '#ffffff' });
    nameLabel.anchor.setTo(0.5, 0.5);
    var tween = game.add.tween(nameLabel).
      to({ y: 80 }, 1000).
      easing(Phaser.Easing.Bounce.Out).
      start();
    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY,
                                   'score: ' + game.global.score,
                                   { font: '25px Arial', fill: '#ffffff' });
    scoreLabel.anchor.setTo(0.5, 0.5);

    // start label + rotation
    var startLabel = game.add.text(game.world.centerX, game.world.height - 80,
                                   'press space to start',
                                   { font: '25px Arial', fill: '#ffffff' });
    startLabel.anchor.setTo(0.5, 0.5);
    var tween = game.add.tween(startLabel).
      to({ angle: -2 }, 500).
      to({ angle: 2 }, 500).
      loop().
      start();

    // Best score stuff
    if (!localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', 0);
    }
    if (game.global.score > localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', game.global.score);
    }
    var bestScoreLabel = game.add.text(game.world.centerX, game.world.centerY + 30,
                                   'best score: ' + localStorage.getItem('bestScore'),
                                   { font: '25px Arial', fill: '#ffffff' });
    bestScoreLabel.anchor.setTo(0.5, 0.5);

    // mute sound
    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;
    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }

    // handle game start
    var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.addOnce(this.start, this);
  },

  start: function () {
    game.state.start('play');
  },

  toggleSound: function() {
    game.sound.mute = !game.sound.mute

    this.muteButton.frame = game.sound.mute ? 1 : 0;
  }
}
