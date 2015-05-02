function TileMap (size, z) {
    this.tileMap = [];
    this.size = size || 71.5;
    this.isoGroup = game.add.group();
    this.zz = z || 0;
}

TileMap.prototype.initiate = function (map) {
    this.setMap (map);
    if (this.tileMap) {
        this.spawnTiles();
    }
};

TileMap.prototype.spawnTiles = function () {
    var tile;
    for (var xx = 0; xx < this.size*4; xx += this.size) {
        for (var yy = 0; yy < this.size*4; yy += this.size) {
            tile = game.add.isoSprite(xx, yy, this.zz, tileImgs[this.tileMap[yy/this.size][xx/this.size]], 0, this.isoGroup);
            tile.anchor.set(0.5, 0);
        }
    }
};

TileMap.prototype.setMap = function (map) {
    this.tileMap = map;
};

TileMap.prototype.update = function () {
    game.iso.unproject(game.input.activePointer.position, game.cursorPos);

    this.isoGroup.forEach(function (tile) {
        var inBounds = tile.isoBounds.containsXY(game.cursorPos.x, game.cursorPos.y);
        if (!tile.selected && inBounds) {
            tile.selected = true;
            if (tile.key == '0') {
                tile.tint = 0x86bfda;
            } else {
                tile.tint = 0xDB4D4D;
            }
            game.add.tween(tile).to({ isoZ: 16 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
        else if (tile.selected && !inBounds) {
            tile.selected = false;
            tile.tint = 0xffffff;
            game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
    });
};

var tileImgs = ['0', 'v', 'h', 'lu', 'ld', 'ru', 'rd'];