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
        [0, 0, 0, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
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
        this.map.initiate(this.tileMap);
        
        this.setUpTitle();
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
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'test', null, true, false);

game.state.add('boot', stateManager.boot);
game.state.add('loading', stateManager.loading);
game.state.add('menu', stateManager.menu);
//game.state.add('level1', stateManager.level1);
//game.state.add('scoreScreen', stateManager.scoreScreen);

game.state.start('boot');