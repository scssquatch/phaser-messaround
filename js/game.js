var game = new Phaser.Game(500, 340, Phaser.AUTO, '');

//set global score
game.global = { score: 0 };

//add states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');
