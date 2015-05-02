var game = new Phaser.Game(800, 600, Phaser.AUTO, 'test', null, true, false);

game.state.add('boot', stateManager.boot);
game.state.add('loading', stateManager.loading);
game.state.add('menu', stateManager.menu);
game.state.add('level1', stateManager.levelOne);
//game.state.add('scoreScreen', stateManager.scoreScreen);

game.state.start('boot');