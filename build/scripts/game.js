var colourSchemes = {
    colourParticles:function (item, colour) {
        var num = item.lifespan/item.parent.lifespan;
        colourSchemes[colour](item, num);
    },
    
    fire: function (item, num) {
        item.tint = '0xFF' + gradient.down(100, 20, num) + '00';
    },
    
    ice: function (item, num) {
        item.tint = '0x'+(20).toString(16) + gradient.down(150, 0, num) + (200).toString(16);
    },
    
    darkIce: function (item, num) {
        item.tint = '0x00' + gradient.up(40, 120, num) + (150).toString(16);
    },
    
    lightIce: function (item, num) {
        item.tint = '0x'+ (80).toString(16) + gradient.down(180, 100, num) + (200).toString(16);
    },
    
    arcane: function (item, num) {
        item.tint = '0x' + gradient.up(40, 220, num) + (60).toString(16) + (180).toString(16);
    },
    
    swamp: function (item, num) {
        item.tint = '0x00' + gradient.up(130, 250, num) + gradient.down(250, 0, num);
    },
    
    swampLight: function (item, num) {
        item.tint = '0x' + (80).toString(16) + gradient.down(250, 130, num) + gradient.up(70, 250, num);
    }
}

var gradient = {
    down: function (max, min, num) {
        return Math.round(Math.abs((num*(max-min))+min)).toString(16);
    },
    
    up: function (min, max, num) {
        return Math.round(Math.abs(max-(num*(max-min)))).toString(16);
    }
}
var inputManager = {
    cursor:{},
    
    controller: null,
    
    initiate: function () {
        
    },
    
    checkKeys: function () {
       
    }
}
var stateManager = function (game) { };

stateManager.boot = function (game) { };

stateManager.boot.prototype = {

    init: function () {

    },

    preload: function () {
        this.load.atlasJSONHash('menuAtlas', 'images/menuAtlas.png', 'images/menuAtlas.json');
        game.time.advancedTiming = true;

        game.plugins.add(new Phaser.Plugin.Isometric(game));
        game.iso.anchor.setTo(0.5, 0.2);
    },

    create: function () {
        game.state.start('loading');
    }
};

stateManager.loading = function (game) { 
    this.preloadBar = null;
    this.loadText = null;
};

stateManager.loading.prototype = {
    init: function () {

    },

    preload: function () {
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'menuAtlas', 'buttonLong_blue_pressed.png');
        this.preloadBar.anchor.setTo(0,0.5);
        this.preloadBar.scale.setTo(1 ,1);
        this.preloadBar.x = this.world.centerX - this.preloadBar.width/2;
        
        this.loadText = this.add.text(this.world.centerX, this.world.centerY, 'Loading...', { 
            font: "30px Orbitron", 
            fill: "#343434", 
            align: "center" });
        this.loadText.anchor.set(0.5, 0.5);
        
        //this.load.atlasJSONHash('gameAtlas', 'images/gameAtlas');
        //this.load.audio('music', ['audio/soundtrack.mp3']);
        this.load.image('0', 'images/landscape_28.png');
        this.load.image('h', 'images/landscape_32.png');
        this.load.image('v', 'images/landscape_29.png');
        this.load.image('lu', 'images/landscape_35.png');
        this.load.image('ld', 'images/landscape_31.png');
        this.load.image('ru', 'images/landscape_39.png');
        this.load.image('rd', 'images/landscape_34.png');
        this.load.image('t1', 'images/tower1.png');
    },

    create: function () {
        this.state.start('menu');
    },

    update: function () {
       /* if (this.cache.isSoundDecoded('music') && this.ready == false){
            game.state.start('menu');
        } */       
    }
};

stateManager.menu = function (game) { 
    this.menuTitleText = null;
    this.menuTitleBG = null;
    this.titleY = 96;
    this.map = null;
    this.tileMap = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    this.towerMap = [
        [0, 0, 0, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 1]
    ];
};


stateManager.menu.prototype = {
    init: function () {

    },

    preload: function () {
        
    },

    create: function () {  
        game.cursorPos = new Phaser.Plugin.Isometric.Point3();
        
        this.map = new TileMap(71.5, 0);
        this.map.initiate(this.tileMap, this.towerMap);
        this.map.spawnTiles(this.map.towerMap, 64, true);
        
        this.setUpTitle();
        
        game.input.onDown.add(function () {
            game.state.getCurrentState().map.place = true;
        });
        
        game.input.onUp.add(function () {
            game.state.getCurrentState().map.place = false;
        });
    },
    
    setUpTitle: function () {
        this.menuTitleBG = this.add.sprite(this.world.centerX, this.titleY, 'menuAtlas', 'panelInset_beige.png');
        this.menuTitleBG.anchor.set(0.5, 0.5);
        this.menuTitleBG.scale.setTo(3 , 0.7);
        
        this.menuTitleText = this.add.text(this.world.centerX, this.titleY, 'Tower Defence', { 
            font: "30px Orbitron", 
            fill: "#343434", 
            align: "center" });
        this.menuTitleText.anchor.set(0.5, 0.5);
    },
    
    update: function () {
        this.map.update();
    }
};
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
    
    if (this.place) { this.placeTower(); }
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
        tile.tint = 0x86bfda;
    } else {
        tile.tint = 0xDB4D4D;
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

TileMap.prototype.placeTower = function () {
    if (this.currentTile.tile && !this.currentTile.tower) {
        var xx = this.currentTile.tile.isoPosition.x;
        var yy = this.currentTile.tile.isoPosition.y;
        var tower = game.add.isoSprite(xx, yy, 64, 't1', 0, this.towerGroup);
        tower.anchor.set(0.5, 0);
        game.iso.simpleSort(this.towerGroup);
        game.add.tween(tower).to({ isoZ: 72 }, 200, Phaser.Easing.Quadratic.InOut, true);
        this.currentTile.tower = tower;
        this.place = false;
    }
};

var tileLandscapes = ['0', 'v', 'h', 'lu', 'ld', 'ru', 'rd'];
var tileTowers = ['t1'];
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'test', null, true, false);

game.state.add('boot', stateManager.boot);
game.state.add('loading', stateManager.loading);
game.state.add('menu', stateManager.menu);
//game.state.add('level1', stateManager.level1);
//game.state.add('scoreScreen', stateManager.scoreScreen);

game.state.start('boot');