function TileMap (size) {
    this.tileMap = [];
    this.towerMap = [];
    this.size = size || 71.5;
    this.tileGroup = game.add.group();
    this.zz = 0;
    
    this.spawners = [];
    
    this.base;

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
        this.spawnTiles(this.towerMap, 64, true);
        this.initiateSpawners();
        game.iso.simpleSort(this.tileGroup);
    }
};

TileMap.prototype.initiateSpawners = function () {
    for (var i = 0; i < this.spawners.length; i++) {
        this.spawners[i].initiate(this.base.getTilePos());
    }
};

TileMap.prototype.spawnTiles = function (tm, zz, tower) {
    var tile, spawner, tileI;
    var m = tm[0].length;
    for (var xx = 0; xx < this.size*m; xx += this.size) {
        for (var yy = 0; yy < this.size*m; yy += this.size) {
            tileI = tm[yy/this.size][xx/this.size];
            if (tower == false) {
                tile = game.add.isoSprite(xx, yy, zz, 'landAtlas', tileLandscapes[tileI], this.tileGroup);
            } else {
                if (tileI != 0 && tileI < 10) {
                    tile = new Tower(game, xx, yy, zz, 'towerAtlas', tileTowers[tileI-1]);
                    this.tileGroup.add(tile);
                } else if (tileI != 0 && tileI >= 10 && tileI < 20){
                    spawner = new Spawner(game.state.getCurrentState(), xx, yy, 53, 6);
                    this.spawners.push(spawner);
                } else if (tileI != 0 && tileI >= 20) {
                    this.base = this.createBase (tileI, xx, yy);
                    this.tileGroup.add(this.base);
                }
            }
            if (tile && tower) {
                tile.anchor.set(0.5, 0);
            } else if (tile) {
                var extension = tile.height % 99;
                var anchorPosY = 0;
                if (extension != 0) { 
                    anchorPosY = extension/tile.height;
                }
                tile.anchor.set(0.5, anchorPosY);
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
    
    if (this.place) { this.placeTower(tileTowers[towerList.currentIndex]); } 
    
    game.iso.simpleSort(this.tileGroup);
};

TileMap.prototype.checkTileForCursor = function (tile) {
    if (tile.tower || tile.enemy) { return; }
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
    this.tileGroup.forEach(this.checkForTower, this, false, tile);

    if (tile.frameName == 'landscape_28.png') {
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
    this.tileGroup.forEach(this.tweenDownTower, this, false, tile);
    
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
    if (tileT.tower) {
        if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
            this.currentTile.tower = tileT;
            game.add.tween(this.currentTile.tower).to({ isoZ: 72 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
    }
};

TileMap.prototype.tweenDownTower = function (tileT, tile){
    if (tileT.tower) {
        if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
            game.add.tween(tileT).to({ isoZ: 64 }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
    }
};

TileMap.prototype.placeTower = function (towerType) {
    if (this.currentTile.tile && !this.currentTile.tower && this.canPlace) {
        var xx = this.currentTile.tile.isoPosition.x;
        var yy = this.currentTile.tile.isoPosition.y;
        var tower = new Tower(game, xx, yy, 64, 'towerAtlas', towerType);
        this.tileGroup.add(tower);
        tower.anchor.set(0.5, 0);
        game.add.tween(tower).to({ isoZ: 72 }, 200, Phaser.Easing.Quadratic.InOut, true);
        this.currentTile.tower = tower;
        this.place = false;
    }
};

TileMap.prototype.createBase = function (i, x, y) {
    var xx = x, 
        yy = y,
        zz = 0,
        tile;
    
    switch (i%20){
            
        case 0:
            yy -= this.size;
            break;
        case 1:
            xx += this.size;
            break;
        case 2:
            yy += this.size;
            break;
        case 3:
            xx -= this.size;
            break;
        
        default:
            break;
            
    }
    
    tile = new Base(xx, yy, zz, new TileVector(x/this.size, y/this.size),'base1.png');
    var extension = (tile.height - 99);
    
    if (i%20 === 0 || i%20 === 3) {
        tile.anchor.set(0.5, extension/tile.height);
    } else {
        tile.isoPosition.z = extension-1;
        tile.anchor.set(0.5, 0);
    }
    return tile;
};
