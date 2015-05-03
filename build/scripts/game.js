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

stateManager.levelOne = function (game) { 
    this.titleText = null;
    this.titleBG = null;
    this.titleY = 550;
    this.map = null;
    this.tileMap = [
        [ 0, 1, 0,11, 0,15],
        [ 0, 1, 0, 0, 0, 0],
        [14, 7, 2, 3, 0,13],
        [ 2, 8, 0, 1, 0, 0],
        [ 0, 6, 2, 9, 2, 2],
        [ 0,16, 0, 0, 0,12]
    ];
    this.towerMap = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];
    this.currentTowerIndex = 0;
    this.currentTowerImage;
    this.maxTowers = 3;
    
    this.backButton = {
        arrow: null,
        button: null
    };
};

stateManager.levelOne.prototype = {
    create: function () { 
        game.input.deleteMoveCallback(0);
        
        this.map = new TileMap(71.5, 0);
        this.map.initiate(this.tileMap, this.towerMap);
        this.map.spawnTiles(this.map.towerMap, 64, true);
        
        this.setUpTitle();
        
        game.input.onDown.add(function (e) {
            this.map.place = true;
        }, this);
        
        game.input.onUp.add(function () {
            this.map.place = false;
        }, this);
        
        this.currentTowerImage = game.add.image(this.world.centerX+300, this.titleY, 'towerAtlas', 'tower1.png');
        this.currentTowerImage.anchor.set(0.5, 0.5);
        
        this.currentTowerImage.inputEnabled = true;
        this.currentTowerImage.input.useHandCursor = true;
        this.currentTowerImage.events.onInputDown.add(this.switchTower, this);
        
       
        this.backButton.button = game.add.button(this.world.centerX-250, this.titleY, 'menuAtlas', this.returnToMenu, this, 'buttonSquare_beige_pressed.png', 'buttonSquare_beige_pressed.png', 'buttonSquare_brown_pressed.png');
        this.backButton.button.scale.setTo(1.3, 1.3);
        this.backButton.button.anchor.set(0.5, 0.5);
        this.backButton.button.input.useHandCursor = true;
        
        this.backButton.arrow = game.add.image(this.world.centerX-250, this.titleY, 'menuAtlas', 'arrowBrown_left.png');
        this.backButton.arrow.anchor.set(0.5, 0.5);
    },
    
    setUpTitle: function () {
        this.titleBG = this.add.sprite(this.world.centerX, this.titleY, 'menuAtlas', 'buttonLong_beige_pressed.png');
        this.titleBG.anchor.set(0.5, 0.5);
        this.titleBG.scale.setTo(1.2 , 1.2);
        
        this.titleText = this.add.text(this.world.centerX, this.titleY, 'Level 1', { 
            font: "30px Orbitron", 
            fill: "#343434", 
            align: "center" });
        this.titleText.anchor.set(0.5, 0.5);
    },
    
    update: function () {
        this.map.update();
    },
    
    loadLevel: function () {
        
    },
    
    switchTower: function () {
        this.currentTowerIndex++;
        this.currentTowerIndex %= 3;
        this.currentTowerImage.frameName = tileTowers[this.currentTowerIndex];
    },
    
    returnToMenu: function () {
        game.state.start('menu');
    }
    
            
};
stateManager.levelTwo = function (game) { 
    this.titleText = null;
    this.titleBG = null;
    this.titleY = 600;
    this.map = null;
    this.tileMap = [
        [14,18, 0,14, 0, 1,16],
        [17,22, 0, 0, 0, 1, 0],
        [ 0, 4, 2, 2, 2, 5,20],
        [ 2, 8,12, 0, 0, 0,18],
        [13, 6, 2, 2, 2, 3,18],
        [ 0,15, 0, 0,11, 1,21],
        [ 0, 0, 0, 0, 0, 1, 0]
    ];
    this.towerMap = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ];
    this.currentTowerIndex = 0;
    this.currentTowerImage;
    this.maxTowers = 3;
    
    this.backButton = {
        arrow: null,
        button: null
    };
};

stateManager.levelTwo.prototype = {
    create: function () { 
        game.input.deleteMoveCallback(0);
        
        this.map = new TileMap(71.5, 0);
        this.map.initiate(this.tileMap, this.towerMap);
        this.map.spawnTiles(this.map.towerMap, 64, true);
        
        this.setUpTitle();
        
        game.input.onDown.add(function (e) {
            this.map.place = true;
        }, this);
        
        game.input.onUp.add(function () {
            this.map.place = false;
        }, this);
        
        this.currentTowerImage = game.add.image(this.world.centerX+300, this.titleY, 'towerAtlas', 'tower1.png');
        this.currentTowerImage.anchor.set(0.5, 0.5);
        
        this.currentTowerImage.inputEnabled = true;
        this.currentTowerImage.input.useHandCursor = true;
        this.currentTowerImage.events.onInputDown.add(this.switchTower, this);
        
       
        this.backButton.button = game.add.button(this.world.centerX-250, this.titleY, 'menuAtlas', this.returnToMenu, this, 'buttonSquare_beige_pressed.png', 'buttonSquare_beige_pressed.png', 'buttonSquare_brown_pressed.png');
        this.backButton.button.scale.setTo(1.3, 1.3);
        this.backButton.button.anchor.set(0.5, 0.5);
        this.backButton.button.input.useHandCursor = true;
        
        this.backButton.arrow = game.add.image(this.world.centerX-250, this.titleY, 'menuAtlas', 'arrowBrown_left.png');
        this.backButton.arrow.anchor.set(0.5, 0.5);
    },
    
    setUpTitle: function () {
        this.titleBG = this.add.sprite(this.world.centerX, this.titleY, 'menuAtlas', 'buttonLong_beige_pressed.png');
        this.titleBG.anchor.set(0.5, 0.5);
        this.titleBG.scale.setTo(1.2 , 1.2);
        
        this.titleText = this.add.text(this.world.centerX, this.titleY, 'Level 2', { 
            font: "30px Orbitron", 
            fill: "#343434", 
            align: "center" });
        this.titleText.anchor.set(0.5, 0.5);
    },
    
    update: function () {
        this.map.update();
    },
    
    loadLevel: function () {
        
    },
    
    switchTower: function () {
        this.currentTowerIndex++;
        this.currentTowerIndex %= 3;
        this.currentTowerImage.frameName = tileTowers[this.currentTowerIndex];
    },
    
    returnToMenu: function () {
        game.state.start('menu');
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
        this.load.atlasJSONHash('landAtlas', 'images/landAtlas.png', 'images/landAtlas.json');
        this.load.atlasJSONHash('towerAtlas', 'images/towerAtlas.png', 'images/towerAtlas.json');
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
    this.levelTitleText = null;
    this.levelTitleBG = null;
    this.titleY = 96;
    this.levelUIY = 450;
    this.map = null;
    this.tileMap = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    this.towerMap = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 7, 0, 0],
        [0, 0, 0, 8]
    ];
    this.town;
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
        this.setUpLevelUI();
        
        
        game.input.addMoveCallback(this.checkTown, this);
        
        game.input.onDown.add(this.loadLevel, this);
    },
    
    setUpTitle: function () {
        this.menuTitleBG = this.add.sprite(this.world.centerX, this.titleY, 'menuAtlas', 'buttonLong_beige.png');
        this.menuTitleBG.anchor.set(0.5, 0.5);
        this.menuTitleBG.scale.setTo(1.6 , 1.3);
        
        this.menuTitleText = this.add.text(this.world.centerX, this.titleY, 'Tower Defence', { 
            font: "30px Orbitron", 
            fill: "#343434", 
            align: "center" });
        this.menuTitleText.anchor.set(0.5, 0.5);
    },
    
    setUpLevelUI: function () {
        this.levelTitleBG = this.add.sprite(this.world.centerX, this.levelUIY, 'menuAtlas', 'buttonLong_beige_pressed.png');
        this.levelTitleBG.anchor.set(0.5, 0.5);
        this.levelTitleBG.scale.setTo(1 , 1);
        
        this.levelTitleText = this.add.text(this.world.centerX,  this.levelUIY, 'Menu', { 
            font: "30px Orbitron", 
            fill: "#343434", 
            align: "center" });
        this.levelTitleText.anchor.set(0.5, 0.5);
    },
    
    update: function () {
        this.map.update();
    },
    
    checkTown: function () {
        if (this.map.currentTile.tower){
            this.town = this.map.currentTile.tower.frameName;
            switch (this.town) {
                case 'city1.png':
                     this.levelTitleText.text = 'Level 1';
                    break;
                    
                case 'city2.png':
                     this.levelTitleText.text = 'Level 2';
                    break;
                    
                default:
                    break;
            }
        } else {
            this.town = null;
            this.levelTitleText.text = 'Menu';
        }
    },
    
    loadLevel: function () {
        switch (this.town) {
            case 'city1.png':
                game.state.start('level1');
                break;
                
            case 'city2.png':
                game.state.start('level2');
                break;
                
            default:
                break;
        }
    }
        
};
var tileLandscapes = ['landscape_28.png', //0 norm
                      'landscape_29.png', //1 vert
                      'landscape_32.png', //2 horiz
                      'landscape_35.png', //3 leftUp
                      'landscape_31.png', //4 leftDown
                      'landscape_39.png', //5 rightUp
                      'landscape_34.png', //6 rightDown
                      'landscape_06.png', //7 3 down
                      'landscape_14.png', //8 3 up
                      'landscape_11.png', //9 3 right
                      'landscape_10.png', //10 3 left
                      'rocks_1.png', //11 
                      'rocks_8.png', //12 
                      'trees_10.png', //13
                      'trees_1.png', //14
                      'crystals_1.png', //15
                      'crystals_3.png', //16
                      'landscape_37.png', //17 water vert
                      'landscape_33.png', //18 water horiz
                      'landscape_01.png', //19 left up1
                      'landscape_36.png', //20 left down
                      'landscape_00.png', //21 right down
                      'landscape_05.png']; //22 right up


var tileTowers = ['tower1.png', //1
                  'tower2.png', //2
                  'tower3.png', //3
                  '', //4
                  '', //5
                  '', //6
                  'city1.png', //7
                  'city2.png'];//8
function TileMap (size) {
    this.tileMap = [];
    this.towerMap = [];
    this.size = size || 71.5;
    this.tileGroup = game.add.group();
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
        game.iso.simpleSort(this.tileGroup);
    }
};

TileMap.prototype.spawnTiles = function (tm, zz, tower) {
    var tile;
    var m = tm[0].length;
    for (var xx = 0; xx < this.size*m; xx += this.size) {
        for (var yy = 0; yy < this.size*m; yy += this.size) {
            if (tower == false) {
                tile = game.add.isoSprite(xx, yy, zz, 'landAtlas', tileLandscapes[tm[yy/this.size][xx/this.size]], this.tileGroup);
            } else {
                if (tm[yy/this.size][xx/this.size] != 0) {
                    tile = new Tower(game, xx, yy, zz, 'towerAtlas', tileTowers[tm[yy/this.size][xx/this.size]-1]);
                    this.tileGroup.add(tile);
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
    
    if (this.place) { this.placeTower(tileTowers[game.state.getCurrentState().currentTowerIndex]); }
};

TileMap.prototype.checkTileForCursor = function (tile) {
    if (tile.tower) { return; }
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
        game.iso.simpleSort(this.tileGroup);
        game.add.tween(tower).to({ isoZ: 72 }, 200, Phaser.Easing.Quadratic.InOut, true);
        this.currentTile.tower = tower;
        this.place = false;
    }
};

function Tower (game, x, y, z, key, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, key, frame);
    
    this.tower = true;
    this.cost = 100;
}

Tower.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Tower.prototype.constructor = Tower;
var game = new Phaser.Game(900, 670, Phaser.AUTO, 'test', null, true, false);

game.state.add('boot', stateManager.boot);
game.state.add('loading', stateManager.loading);
game.state.add('menu', stateManager.menu);
game.state.add('level1', stateManager.levelOne);
game.state.add('level2', stateManager.levelTwo);
//game.state.add('scoreScreen', stateManager.scoreScreen);

game.state.start('boot');