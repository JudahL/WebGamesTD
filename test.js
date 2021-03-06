// Test, code based on example by mfpierre (Isometric Phaser Plugin)
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'test', null, true, false);
 
var BasicGame = function (game) { };
 
BasicGame.Boot = function (game) { };
 
var isoGroup, cursorPos, cursor;
 
BasicGame.Boot.prototype =
{
    preload: function () {
        game.load.image('0', 'images/landscape_28.png');
        game.load.image('h', 'images/landscape_32.png');
        game.load.image('v', 'images/landscape_29.png');
        game.load.image('lu', 'images/landscape_35.png');
        game.load.image('ld', 'images/landscape_31.png');
        game.load.image('ru', 'images/landscape_39.png');
        game.load.image('rd', 'images/landscape_34.png');
 
        game.time.advancedTiming = true;
 
        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));
 
        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.2);
 
 
    },
    create: function () {
 
        // Create a group for our tiles.
        isoGroup = game.add.group();
 
        // Let's make a load of tiles on a grid.
        this.spawnTiles();
 
        // Provide a 3D position for the cursor
        cursorPos = new Phaser.Plugin.Isometric.Point3();
    },
    update: function () {
        // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
        game.iso.unproject(game.input.activePointer.position, cursorPos);
 
        // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        isoGroup.forEach(function (tile) {
            var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                if (tile.key == '0') {
                    tile.tint = 0x86bfda;
                } else {
                    tile.tint = 0xDB4D4D;
                }
                game.add.tween(tile).to({ isoZ: 16 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
                // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
                game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
            }
        });
    },
    render: function () {
    },
    spawnTiles: function () {
        var tile;
        for (var xx = 0; xx < size*6; xx += size) {
            for (var yy = 0; yy < size*6; yy += size) {
                // Create a tile using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                tile = game.add.isoSprite(xx, yy, 0, tileImgs[tileMap[yy/size][xx/size]], 0, isoGroup);
                tile.anchor.set(0.5, 0);
            }
        }
    }
};
 
game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
 
var tileMap = [
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [2, 2, 2, 2, 3, 0],
   [0, 0, 0, 0, 1, 0],
   [0, 0, 0, 0, 1, 0],
   [0, 0, 0, 0, 1, 0],
];
 
var size = 71.5;
 
var tileImgs = ['0', 'v', 'h', 'lu', 'ld', 'ru', 'rd'];