function TileMap (size) {
    this.tileMap = [];
    this.towerMap = [];
    this.size = size || 71.5;
    this.isoGroup = game.add.group();
    this.towerGroup = game.add.group();
    this.zz = 0;
    
    this.currentTower;
}

TileMap.prototype.initiate = function (map, tMap) {
    this.setMap (map, tMap);
    if (this.tileMap) {
        this.spawnTiles(this.tileMap, this.zz, false);
    }
};

TileMap.prototype.spawnTiles = function (tm, zz, tower) {
    var tile;
    var m = tm[0].length;
    for (var xx = 0; xx < this.size*m; xx += this.size) {
        for (var yy = 0; yy < this.size*m; yy += this.size) {
            if (tower == false) {
                tile = game.add.isoSprite(xx, yy, zz, tileLandscapes[tm[yy/this.size][xx/this.size]], 0, this.isoGroup);
            } else {
                if (tm[yy/this.size][xx/this.size] != 0) {
                    tile = game.add.isoSprite(xx, yy, zz, tileTowers[tm[yy/this.size][xx/this.size]-1], 0, this.towerGroup);
                }
            }
            if (tile) { tile.anchor.set(0.5, 0); }
        }
    }
};

TileMap.prototype.setMap = function (map, tMap) {
    this.tileMap = map;
    this.towerMap = tMap;
};

TileMap.prototype.update = function () {
    game.iso.unproject(game.input.activePointer.position, game.cursorPos);

    this.isoGroup.forEach(this.checkTileForCursor, this);
};

TileMap.prototype.checkTileForCursor = function (tile) {
    var inBounds = tile.isoBounds.containsXY(game.cursorPos.x, game.cursorPos.y);
    if (!tile.selected && inBounds) {
        tile.selected = true;
        if (tile.key == '0') {
            tile.tint = 0x86bfda;
        } else {
            tile.tint = 0xDB4D4D;
        }
        game.add.tween(tile).to({ isoZ: 16 }, 200, Phaser.Easing.Quadratic.InOut, true);
        this.towerGroup.forEach(this.checkForTower, this, false, tile);
    } else if (tile.selected && !inBounds) {
        tile.selected = false;
        tile.tint = 0xffffff;
        game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
         this.towerGroup.forEach(this.tweenDownTower, this, false, tile);
    }
};

TileMap.prototype.checkForTower = function (tileT, tile){
    if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
        this.currentTower = tileT;
        game.add.tween(this.currentTower).to({ isoZ: 80 }, 200, Phaser.Easing.Quadratic.InOut, true);
    }
};

TileMap.prototype.tweenDownTower = function (tileT, tile){
    if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
        game.add.tween(tileT).to({ isoZ: 64 }, 200, Phaser.Easing.Quadratic.InOut, true);
    }
};

var tileLandscapes = ['0', 'v', 'h', 'lu', 'ld', 'ru', 'rd'];
var tileTowers = ['t1'];