var game = new Phaser.Game(900, 670, Phaser.AUTO, 'test', null, true, false);

game.state.add('boot', stateManager.boot);
game.state.add('loading', stateManager.loading);
game.state.add('menu', stateManager.menu);
game.state.add('level1', stateManager.levelOne);
game.state.add('level2', stateManager.levelTwo);
//game.state.add('scoreScreen', stateManager.scoreScreen);

game.state.start('boot');