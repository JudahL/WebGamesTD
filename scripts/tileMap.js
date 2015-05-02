function TileMap (size) {
    this.tileMap = [];
    this.towerMap = [];
    this.size = size || 71.5;
    this.tileGroup = game.add.group();
    this.towerGroup = game.add.group();
    this.zz = 0;
    
    this.currentTower;
    this.currentTile;
    this.tileSelected = false;
    this.towerSelected = false;
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
                tile = game.add.isoSprite(xx, yy, zz, tileLandscapes[tm[yy/this.size][xx/this.size]], 0, this.tileGroup);
            } else {
                if (tm[yy/this.size][xx/this.size] != 0) {
                    tile = game.add.isoSprite(xx, yy, zz, tileTowers[tm[yy/this.size][xx/this.size]-1], 0, this.towerGroup);
                }
            }
            if (tile) {
                tile.anchor.set(0.5, 0);
            }
        }
    }
};

TileMap.prototype.setMap = function (map, tMap) {
    this.tileMap = map;
    this.towerMap = tMap;
};

TileMap.prototype.update = function () {
    game.iso.unproject(game.input.activePointer.position, game.cursorPos);

    this.tileGroup.forEach(this.checkTileForCursor, this);
};

TileMap.prototype.checkTileForCursor = function (tile) {
    var inBounds = tile.isoBounds.containsXY(game.cursorPos.x, game.cursorPos.y);
    if (!tile.selected && inBounds) {
        tile.selected = true;
        this.currentTile = tile;
        this.tileSelected = true;
        game.add.tween(tile).to({ isoZ: 8 }, 200, Phaser.Easing.Quadratic.InOut, true);
        
        this.towerGroup.forEach(this.checkForTower, this, false, tile);
        
        if (tile.key == '0' && !this.towerSelected) {
            tile.tint = 0x86bfda;
        } else {
            tile.tint = 0xDB4D4D;
        }
    } else if (tile.selected && !inBounds) {
        tile.selected = false;
        tile.tint = 0xffffff;
        this.tileSelected = false;
        game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
         this.towerGroup.forEach(this.tweenDownTower, this, false, tile);
    }
};

TileMap.prototype.checkForTower = function (tileT, tile){
    if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
        this.currentTower = tileT;
        this.towerSelected = true;
        game.add.tween(this.currentTower).to({ isoZ: 72 }, 200, Phaser.Easing.Quadratic.InOut, true);
    }
};

TileMap.prototype.tweenDownTower = function (tileT, tile){
    if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
        game.add.tween(tileT).to({ isoZ: 64 }, 200, Phaser.Easing.Quadratic.InOut, true);
        this.towerSelected = false;
    }
};

TileMap.prototype.placeTower = function () {
    if (this.tileSelected && !this.towerSelected) {
        var xx = this.currentTile.isoPosition.x;
        var yy = this.currentTile.isoPosition.y;
        var tower = game.add.isoSprite(xx, yy, 64, 't1', 0, this.towerGroup);
        tower.anchor.set(0.5, 0);
        game.iso.simpleSort(this.towerGroup);
        game.add.tween(tower).to({ isoZ: 72 }, 200, Phaser.Easing.Quadratic.InOut, true);
    }
};

var tileLandscapes = ['0', 'v', 'h', 'lu', 'ld', 'ru', 'rd'];
var tileTowers = ['t1'];