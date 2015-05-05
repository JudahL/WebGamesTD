function TileMap (size) {
    this.tileMap = [];
    this.objectMap = [];
    this.size = size || 71.5;
    this.tileGroup = game.add.group();
    
    this.objectOffset = 4;
    this.hoverOffset = 8;
    
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

TileMap.prototype.initiate = function (map, oMap) {
    this.setMap (map, oMap);
    if (this.tileMap) {
        this.spawnTiles(this.tileMap, 0, false);
        this.spawnTiles(this.objectMap, this.objectOffset, true);
        this.initiateSpawners();
        game.iso.simpleSort(this.tileGroup);
    }
};

TileMap.prototype.initiateSpawners = function () {
    for (var i = 0; i < this.spawners.length; i++) {
        this.spawners[i].initiate(this.base.getTilePos());
    }
};

TileMap.prototype.spawnTiles = function (tm, z, object) {
    var tile, spawner, tileI;
    var m = tm[0].length;
    for (var x = 0; x < this.size*m; x += this.size) {
        for (var y = 0; y < this.size*m; y += this.size) {
            tile = null;
            tileI = tm[y/this.size][x/this.size];
            
            if (object == false) {
                //Create Landscape
                tile = game.add.isoSprite(x, y, z, 'landAtlas', tileLandscapes[tileI], this.tileGroup);
                
                var extension = tile.height % 99;
                var anchorPosY = 0;
                if (extension != 0) { anchorPosY = extension/tile.height; }
                tile.anchor.set(0.5, anchorPosY);
            } else if (tileI != 0){
                if (tileI < 10) {
                    //Create Tower
                    tile = new Tower(this, x, y, z, towerList.get('frame'));
                    this.tileGroup.add(tile);
                    tile.initiate();
                    tile.anchor.set(0.5, 0.5);
                } else if (tileI >= 10 && tileI < 20){
                    //Create Spawner
                    spawner = new Spawner(game.state.getCurrentState(), x, y, 53, 6);
                    this.spawners.push(spawner);
                } else if (tileI >= 20 && tileI < 30) {
                    //Create Base
                    this.base = this.createBase (tileI, x, y);
                    this.tileGroup.add(this.base);
                } else if (tileI >= 30) {
                    //Create City (Menu Only)
                    tile = game.add.isoSprite(x, y, z, 'towerAtlas', tileCities[tileI%30], this.tileGroup);
                    tile.anchor.set(0.5, 0.5);
                    tile.tower = true;
                }
            }
        }
    }
};

TileMap.prototype.setMap = function (map, oMap) {
    this.tileMap = map;
    this.objectMap = oMap;
};

TileMap.prototype.update = function () {
    game.iso.unproject(game.input.activePointer.position, game.cursorPos);
    
    this.tileGroup.forEach(this.checkTileForCursor, this);
    
    if (this.place) { this.placeTower(tileTowers[towerList.currentIndex]); } 
    
    game.iso.simpleSort(this.tileGroup);
};

TileMap.prototype.checkTileForCursor = function (tile) {
    if (tile.key != 'landAtlas') { return; }
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
    
    game.add.tween(tile).to({ isoZ: this.hoverOffset }, 200, Phaser.Easing.Quadratic.InOut, true);
    
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
            game.add.tween(this.currentTile.tower).to({ isoZ: this.objectOffset+this.hoverOffset }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
    }
};

TileMap.prototype.tweenDownTower = function (tileT, tile){
    if (tileT.tower) {
        if (tileT.isoPosition.x == tile.isoPosition.x && tileT.isoPosition.y == tile.isoPosition.y){
            game.add.tween(tileT).to({ isoZ: this.objectOffset }, 200, Phaser.Easing.Quadratic.InOut, true);
        }
    }
};

TileMap.prototype.placeTower = function (towerType) {
    if (this.currentTile.tile && !this.currentTile.tower && this.canPlace) {
        var x = this.currentTile.tile.isoPosition.x;
        var y = this.currentTile.tile.isoPosition.y;
        var tower = new Tower(this, x, y, this.objectOffset+this.hoverOffset*2 , towerType);
        this.tileGroup.add(tower);
        tower.initiate();
        tower.anchor.set(0.5, 0.5);
        game.add.tween(tower).to({ isoZ: this.objectOffset+this.hoverOffset }, 200, Phaser.Easing.Quadratic.InOut, true);
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

TileMap.prototype.addLiving = function (array) {
    for (var i = 0; i < this.spawners.length; i++) {
        this.spawners[i].addLiving(array);
    }
};
