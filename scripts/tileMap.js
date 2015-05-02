function TileMap (size) {
    this.tileMap = [];
    this.towerMap = [];
    this.size = size || 71.5;
    this.tileGroup = game.add.group();
    this.towerGroup = game.add.group();
    this.zz = 0;

    this.currentTile = {
        tile: null,
        x: 0,
        y: 0,
        tower: null
        
    };
    this.place = false;
    this.canPlace = true;
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
                    tile = game.add.isoSprite(xx, yy, zz, 'towerAtlas', tileTowers[tm[yy/this.size][xx/this.size]-1], this.towerGroup);
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
    
    if (this.place) { this.placeTower(tileTowers[game.state.getCurrentState().currentTowerIndex]); }
};

TileMap.prototype.checkTileForCursor = function (tile) {
    var inBounds = tile.isoBounds.containsXY(game.cursorPos.x, game.cursorPos.y);
    if (!tile.selected && inBounds) {
        this.selectTile(tile);
    } else if (tile.selected && !inBounds) {
        this.deselectTile(tile);
    }
};

TileMap.prototype.selectTile = function (tile) {
    tile.selected = true;
    this.setCurrentTile(tile);
    
    game.add.tween(tile).to({ isoZ: 8 }, 200, Phaser.Easing.Quadratic.InOut, true);
    
    this.currentTile.tower = null;
    this.towerGroup.forEach(this.checkForTower, this, false, tile);

    if (tile.key == '0') {
        this.canPlace = true;
        tile.tint = 0x86bfda;
    } else {
        this.canPlace = false;
        tile.tint = 0xBB4D4D;
    }
};

TileMap.prototype.deselectTile = function (tile) {
    tile.selected = false;
    tile.tint = 0xffffff;
    game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
    this.towerGroup.forEach(this.tweenDownTower, this, false, tile);
    
    if (tile.isoPosition.x == this.currentTile.x && tile.isoPosition.y == this.currentTile.y) { this.unsetCurrentTile(tile); }
};

TileMap.prototype.setCurrentTile = function (tile) {
    this.currentTile.tile = tile;
    this.currentTile.x = tile.isoPosition.x;
    this.currentTile.y = tile.isoPosition.y;
};

TileMap.prototype.unsetCurrentTile = function (tile) {
    this.currentTile.tile = null;
    this.currentTile.tower = null;
};

TileMap.prototype.checkForTower = function (tileT, tile){
    if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
        this.currentTile.tower = tileT;
        game.add.tween(this.currentTile.tower).to({ isoZ: 72 }, 200, Phaser.Easing.Quadratic.InOut, true);
    }
};

TileMap.prototype.tweenDownTower = function (tileT, tile){
    if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
        game.add.tween(tileT).to({ isoZ: 64 }, 200, Phaser.Easing.Quadratic.InOut, true);
    }
};

TileMap.prototype.placeTower = function (towerType) {
    if (this.currentTile.tile && !this.currentTile.tower && this.canPlace) {
        var xx = this.currentTile.tile.isoPosition.x;
        var yy = this.currentTile.tile.isoPosition.y;
        var tower = game.add.isoSprite(xx, yy, 64, 'towerAtlas', towerType, this.towerGroup);
        tower.anchor.set(0.5, 0);
        game.iso.simpleSort(this.towerGroup);
        game.add.tween(tower).to({ isoZ: 72 }, 200, Phaser.Easing.Quadratic.InOut, true);
        this.currentTile.tower = tower;
        this.place = false;
    }
};