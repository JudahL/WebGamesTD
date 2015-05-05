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
function AStarMap () {
    this.data = null;
}

AStarMap.prototype.initiate = function (data) {
    this.data = data;
};

AStarMap.prototype.outOfBounds = function (x, y) {
    return x < 0 || x >= this.data.length || y < 0 || y >= this.data.length;
};

AStarMap.prototype.blocked = function (x, y) {
    if (this.outOfBounds(x,y)) { return true; }
    if (this.data[y][x] === 0){ return true; }
    
    return false;
};

AStarMap.prototype.getNeighbors = function (x, y) {
    var neighbors = [];
    
    if (!this.blocked(x, y - 1)) { neighbors.push(new TileVector(x, y - 1)) }
    if (!this.blocked(x + 1, y)) { neighbors.push(new TileVector(x + 1, y)) }
    if (!this.blocked(x, y + 1)) { neighbors.push(new TileVector(x, y + 1)) }
    if (!this.blocked(x - 1, y)) { neighbors.push(new TileVector(x - 1, y)) }
        
    return neighbors;
};

AStarMap.prototype.getCost = function (x, y) {
    return this.data[y][x];
};

function TileVector (x, y) {
    this.x = x;
    this.y = y;
}
function Node (xC, yC, xT, yT, totalSteps, parentNode) {
    this.x = xC;
    this.y = yC;
    this.g = totalSteps;
    this.h = this.manhattanDistance(xC, yC, xT, yT);
    this.f = totalSteps + this.manhattanDistance(xC, yC, xT, yT);
    this.parent = parentNode;
}

Node.prototype.manhattanDistance = function (xC, yC, xT, yT) {
    var dx = Math.abs(xT - xC), 
        dy = Math.abs(yT - yC);
    return dx + dy;
};
//Based on the pathfinding solution created by Ash Blue (http://ashblue.github.io/javascript-pathfinding/)
function AStarPathfinder () {
    this.map = null;
    this.closed = null;
    this.open = null;
    this.history = null;
    this.step = 0;
}

AStarPathfinder.prototype.initiate = function (map) {
    this.closed = [];
    this.open = [];
    this.history = [];
    this.map = map;
};

AStarPathfinder.prototype.addClosed = function (step) {
   // this.addHistory(step, 'closed');
    this.closed.push(step);
    return this;
};

AStarPathfinder.prototype.inClosed = function (step) {
    for (var i = 0; i < this.closed.length; i++) {
        if (this.closed[i].x === step.x 
            && this.closed[i].y === step.y) {
                return this.closed[i];
        }
    }
    
    return false;
};

AStarPathfinder.prototype.addOpen = function (step) {
    this.open.push(step);
    return this;
};

AStarPathfinder.prototype.removeOpen = function (step) {
    for (var i = 0; i < this.open.length; i++) {
        if (this.open[i] === step) { this.open.splice(i, 1); }
    }
    
    return this;
};

AStarPathfinder.prototype.inOpen = function (step) {
    for (var i = 0; i < this.open.length; i++) {
        if (this.open[i].x === step.x && this.open[i].y === step.y) {
            return this.open[i];
        }
    }
    
    return false;
};

AStarPathfinder.prototype.getBestOpen = function () {
    var bestI = 0;
    for (var i = 0; i < this.open.length; i++){
        if (this.open[i].f < this.open[bestI].f) { bestI = i; }
    }
    
    return this.open[bestI];
};

AStarPathfinder.prototype.findPath = function (xC, yC, xT, yT) {
    var current,
        neighbors,
        neighborRecord,
        stepCost,
        i;
    
    this.reset().addOpen(new Node(xC, yC, xT, yT, this.step, false));
    
    while (this.open.length !== 0) {
        this.step++;
        current = this.getBestOpen();
        
        if (current.x === xT && current.y === yT) {
            return this.buildPath(current, []);
        }
        
        this.removeOpen(current).addClosed(current);
        
        neighbors = this.map.getNeighbors(current.x, current.y);
        for (i = 0; i < neighbors.length; i++) {
            this.step++;
            
            stepCost = current.g + this.map.getCost(neighbors[i].x, neighbors[i].y);
            
            neighborRecord = this.inClosed(neighbors[i]);
            if (!neighborRecord || stepCost < neighborRecord.g) {
                if (!neighborRecord){
                    this.addOpen(new Node(neighbors[i].x, neighbors[i].y, xT, yT, stepCost, current));
                } else {
                    neighborRecord.parent = current;
                    neighborRecord.g = stepCost;
                    neighborRecord.f = stepCost + neighborRecord.h;
                }
            }        
        }
    }     
};

AStarPathfinder.prototype.buildPath = function (tile, stack) {
    stack.push(tile);
    
    if (tile.parent) {
        return this.buildPath(tile.parent, stack);
    } else {
        return stack;
    }
};

AStarPathfinder.prototype.reset = function () {
        this.closed = [];
        this.open = [];
        return this;
};

AStarPathfinder.prototype.test = function () {
    var map = new AStarMap();
    map.initiate(testMap);
    
    this.initiate(map);
    
    var path = this.findPath(0, 0, 0, 4);
    console.log(path);
};

var testMap = [
    [1, 0, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 0]
]
function Base (x, y, z, tilePos, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.tower = true;
    
    this.health = {
        current: 100,
        max: 100
    };
    
    this.tilePos = tilePos
}

Base.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Base.prototype.constructor = Base;

Base.prototype.getTilePos = function () {
    return this.tilePos;
};  
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

function Enemy (x, y, z, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.enemy = true;
    
    this.pathfinder;
    this.map;
    
    this.path = [];
    this.currentNode = new TileVector(x/71.5, y/71.5);
    this.currentStep;
    
    this.target;
    
    this.moveTimer = game.time.create(false);
    this.deathTimer = game.time.create(false);
    
    //For pathfinding
    this.tilePos = {
        x: x/71.5,
        y: y/71.5
    };
    
    this.frames = {
        up: 'batteringRamUp.png',
        down: 'batteringRamDown.png',
        left: 'batteringRamLeft.png',
        right: 'batteringRamRight.png'
    };
    
    this.life = { //can't use 'health' as Phaser sprites already have a health property
        current: 100,
        max: 100
    };
    this.damage = 10;
    this.goldValue = 10;
    
    this.group;
    
    this.tween;
    
    this.dead = false;
}

Enemy.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.initiate = function (target, pfMap, group) {
    this.target = target;
    
    this.map = new AStarMap();
    this.pathfinder = new AStarPathfinder();
    
    this.map.initiate(pfMap);
    this.pathfinder.initiate(this.map);
    
    if (group) {
        this.group = group;
        this.group.add(this);
    }
};

Enemy.prototype.setUp = function (){
    this.path = this.pathfinder.findPath(this.tilePos.x, this.tilePos.y, this.target.x, this.target.y);
    
    this.currentStep = this.path.length - 1;
    
    this.moveTimer.loop(Phaser.Timer.SECOND, this.move, this);
    this.moveTimer.start();
};

Enemy.prototype.move = function () {
    this.currentStep--;
    
    if (this.currentStep < 0) { 
        player.takeDamage(10);
        this.suicide();
        return; 
    }
    
    this.currentNode = this.path[this.currentStep];
    
    this.changeFrame();
    
    this.tilePos.x = this.currentNode.x;
    this.tilePos.y = this.currentNode.y;
    
    this.updateWorldPos();
};

Enemy.prototype.updateWorldPos = function () {
    var isoX = this.tilePos.x*71.5;
    var isoY = this.tilePos.y*71.5;
    
    this.tween = game.add.tween(this).to({ isoX: isoX, isoY: isoY }, 1000, Phaser.Easing.Quadratic.InOut, true);
};

Enemy.prototype.changeFrame = function () {
    if (this.currentNode.x > this.tilePos.x) {
        this.frameName = this.frames.down; 
    } else if (this.currentNode.x < this.tilePos.x) {
        this.frameName = this.frames.up; 
    } else if (this.currentNode.y < this.tilePos.y) {
        this.frameName = this.frames.right; 
    } else if (this.currentNode.y > this.tilePos.y) {
        this.frameName = this.frames.left; 
    }
};

Enemy.prototype.spawn = function (x, y, z, updateLife) {  
    if (updateLife) { 
        this.life.max = updateLife;
    }
    this.dead = false;
    
    this.body.allowGravity = false;
    this.body.collideWorldBounds = false;
    this.body.reset(0, 0, 0);
    this.body.enable = false;
    
    this.isoX = x;
    this.isoY = y;
    this.isoZ = z;
    
    this.tilePos.x = this.isoX/71.5;
    this.tilePos.y = this.isoY/71.5;
    
    this.revive();
    
    this.life.current = this.life.max;
    
    this.setUp();
};

Enemy.prototype.takeDamage = function (damage, dx, dy) {
    if (this.dead) { return; }
    this.life.current -= damage;
    
    if (this.life.current < 0) {
        this.moveTimer.stop(true);
        this.tween.stop();
        this.isoZ = 90;
        this.knockback(dx, dy);
        this.dead = true;
        player.addGold(this.goldValue);
    }
};

Enemy.prototype.suicide = function () {
    this.kill();
    this.moveTimer.stop(true);
    this.tween.stop();
};

Enemy.prototype.knockback = function (dx, dy) {
    this.body.enable = true;
    this.body.allowGravity = true;
    this.body.gravity.setTo(0, 0, -700);
    this.body.velocity.setTo(dx*5, dy*5, 300);
    this.body.bounce.set(0.5, 0.5, 0.3);
    this.body.maxVelocity.setTo(300, 300, 300);
    this.body.deltaMax.setTo(20, 20, 20);
    
    this.deathTimer.add(Phaser.Timer.SECOND * 1, this.die, this);
    this.deathTimer.start();
};

Enemy.prototype.die = function () {
    this.deathTimer.stop();
    this.kill();
    this.body.allowGravity = false;
    this.body.reset(0, 0, 0);
    this.body.enable = false;
    this.body.bounce.set(0, 0, 0);
}
function InfoBar (x, y, text, colour, value) {
    this.name = text;
    
    this.x = x;
    this.y = y;
    
    this.bar = {
        textValue: text + ": ",
        text: null,
        offset: 0,
        l: null,
        m: null,
        r: null,
        colour: colour
    };
    
    this.value = {
        current: value,
        max: value
    }
}

InfoBar.prototype.createBar = function (offset) {
    var bar = this.bar;
    bar.offset = offset;
    
    bar.l = game.add.image(this.x-25*3, this.y+bar.offset, 'menuAtlas', 'bar' + bar.colour + '_horizontalLeft.png');
    bar.l.anchor.set(1, 0.5);
    bar.m = game.add.image(this.x-25*3, this.y+bar.offset, 'menuAtlas', 'bar' + bar.colour + '_horizontalMid.png');
    bar.m.anchor.set(0, 0.5);
    bar.r = game.add.image(bar.m.x + bar.m.width, this.y+bar.offset, 'menuAtlas', 'bar' + bar.colour + '_horizontalRight.png');
    bar.r.anchor.set(0, 0.5);
    
    bar.text = game.add.text(this.x, this.y+bar.offset, bar.textValue, { 
            font: "22px Neucha", 
            fill: "#343434", 
            align: "center" });
    bar.text.anchor.set(0.5, 0.5);
};

InfoBar.prototype.update = function () {
    this.bar.m.width = this.value.current * (150/100) * (100/this.value.max) + 1;
    this.bar.r.x = this.bar.m.x + this.bar.m.width - 1;
    
    this.bar.text.text = this.bar.textValue + this.value.current;
};
stateManager.levelOne = new Level(game, 'Level One', 550,
    [
        [ 0, 1, 0,11, 0,15],
        [ 0, 1, 0, 0, 0, 0],
        [14, 7, 2, 3, 0,13],
        [ 2, 8, 0, 1,14, 0],
        [ 0, 6, 2, 9, 2, 2],
        [ 0,16, 0, 0, 0,12]
    ],
    [
        [0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0],
        [1, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0]
    ],
    [                             
        [ 0,10, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0, 0],
        [11, 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0,21],
        [ 0, 0, 0, 0, 0, 0]
    ]);


stateManager.levelTwo = new Level (game, 'Level Two', 600,
    [
        [14,18, 0,14, 0, 1,16],
        [17,22, 0, 0, 0, 1, 0],
        [ 0, 4, 2, 2, 2, 5,20],
        [ 2, 8,12, 0, 0, 0,18],
        [13, 6, 2, 2, 2, 3,18],
        [ 0,15, 0, 0,11, 1,21],
        [ 0, 0, 0, 0, 0, 1, 0]
    ],
    [
        [0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 0]
    ],
    [
        [0, 0, 0, 0, 0,11, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [23, 0, 0, 0, 0, 0,0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0,10, 0]
    ]);
function Level (game, title, titleY, tileM, pathM, towerM) { 
    this.titleText = null;
    this.titleTextValue = title;
    this.titleBG = null;
    this.titleY = titleY;
    this.map = null;
    this.tileMap = tileM;
    this.pathfindingMap = pathM;
    this.towerMap = towerM;
    
    this.currentTowerImage;
    
    this.backButton = {
        arrow: null,
        button: null
    };
    
    this.info;
    this.towerInfo;
    
    this.goldTimer;
    
    this.endTimer;
};

Level.prototype.create = function () { 
    game.input.deleteMoveCallback(0);

    this.map = new TileMap(71.5, 0);
    this.map.initiate(this.tileMap, this.towerMap);

    this.setUpTitle();
    this.setUpTowerSelector();
    this.setUpBackButton();
    this.setUpInfo();
    this.setUpTowerInfo();
    this.setUpInput();
    
    this.goldTimer = game.time.events.loop(Phaser.Timer.SECOND, this.grantGold, this);
    this.endTimer = game.time.events.add(Phaser.Timer.SECOND*120, this.winLevel, this);
};

    
Level.prototype.setUpTowerSelector = function () {
    player.reset();
    towerList.reset();
    
    this.currentTowerBG = game.add.image(this.world.centerX+380, this.titleY, 'menuAtlas', 'panel_beige.png');

    this.currentTowerBG.scale.setTo(1.3, 1.3);
    this.currentTowerBG.anchor.set(0.5, 0.5);

    this.currentTowerImage = game.add.image(this.world.centerX+380, this.titleY, 'towerAtlas', towerList.get('frame'));
    this.currentTowerImage.anchor.set(0.5, 0.5);

    this.currentTowerImage.inputEnabled = true;
    this.currentTowerImage.input.useHandCursor = true;
    this.currentTowerImage.events.onInputDown.add(this.switchTower, this);
};
    
Level.prototype.setUpBackButton = function () {
    this.backButton.button = game.add.button(50, 50, 'menuAtlas', this.returnToMenu, this, 
                'buttonSquare_beige_pressed.png', 'buttonSquare_beige_pressed.png', 'buttonSquare_brown_pressed.png');

    this.backButton.button.scale.setTo(1.3, 1.3);
    this.backButton.button.anchor.set(0.5, 0.5);
    this.backButton.button.input.useHandCursor = true;

    this.backButton.arrow = game.add.image(50, 50, 'menuAtlas', 'arrowBrown_left.png');
    this.backButton.arrow.anchor.set(0.5, 0.5);
};

Level.prototype.setUpTitle = function () {
    this.titleBG = this.add.sprite(this.world.centerX, this.titleY, 'menuAtlas', 'buttonLong_beige_pressed.png');
    this.titleBG.anchor.set(0.5, 0.5);
    this.titleBG.scale.setTo(1.2 , 1.2);

    this.titleText = this.add.text(this.world.centerX, this.titleY, this.titleTextValue, { 
        font: "30px Neucha", 
        fill: "#343434", 
        align: "center" });
    this.titleText.anchor.set(0.5, 0.5);
};

Level.prototype.setUpInfo = function () {
    this.info = new PlayerInfo (this.world.centerX-230, this.titleY, 'healthPanel.png');
    this.info.initiate();

    this.info.add('Health','Green', player.health.max, 0);
    this.info.add('Gold', 'Yellow', player.gold.max, 25); 
};

Level.prototype.setUpTowerInfo = function () {
    this.towerInfo = new PlayerInfo (this.world.centerX+230, this.titleY, 'panel3.png');
    this.towerInfo.initiate();
    
    this.towerInfo.add('Attack Speed', 'Blue', 90, -25);
    this.towerInfo.add('Damage','Red', 200, 0);
    this.towerInfo.add('Gold Cost', 'Yellow', 100, 25);
};

Level.prototype.setUpInput = function () {
    game.input.onDown.add(function (e) {
        this.map.place = true;
    }, this);

    game.input.onUp.add(function () {
        this.map.place = false;
    }, this);
};

Level.prototype.update = function () {
    this.map.update();
    this.info.update();
    this.towerInfo.update();
    this.info.setValue('Health', player.health.current);
    this.info.setValue('Gold', player.gold.current);
    this.towerInfo.setValue('Attack Speed', towerList.get('attackSpeed'));
    this.towerInfo.setValue('Damage', towerList.get('damage'));
    this.towerInfo.setValue('Gold Cost', towerList.get('cost'));
};

Level.prototype.switchTower = function () {
    towerList.switchTower();
    this.currentTowerImage.frameName = towerList.get('frame');
};

Level.prototype.returnToMenu = function () {
    game.state.start('menu');
};        

Level.prototype.grantGold = function () {
    player.addGold(1);
};

Level.prototype.levelEnd = function (state) {
    player.setState(state);
    this.returnToMenu();
};

Level.prototype.winLevel = function () {
    this.levelEnd('win');
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
            font: "30px Neucha", 
            fill: "#343434", 
            align: "center" });
        this.loadText.anchor.set(0.5, 0.5);
        
        //this.load.atlasJSONHash('gameAtlas', 'images/gameAtlas');
        //this.load.audio('music', ['audio/soundtrack.mp3']);
        this.load.image('enemy1', 'images/enemy1.png');
        this.load.atlasJSONHash('landAtlas', 'images/landAtlas.png', 'images/landAtlas.json');
        this.load.atlasJSONHash('towerAtlas', 'images/towerAtlas.png', 'images/towerAtlas.json');
    },

    create: function () {
        towerList.initiate();
        
        game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
        game.physics.isoArcade.setBounds(0, 0, 0, 500, 500, 1000);
        
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
    this.stateText = null;
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
        [0,30, 0, 0],
        [0, 0, 0,31]
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
        
        this.setUpTitle();
        this.setUpLevelUI();
        
        
        game.input.addMoveCallback(this.checkTown, this);
        
        game.input.onDown.add(this.loadLevel, this);
        
        if (player.state != 'none'){
            this.showStateText();
        }
        player.state = 'none';
    },
    
    setUpTitle: function () {
        this.menuTitleBG = this.add.sprite(this.world.centerX, this.titleY, 'menuAtlas', 'buttonLong_beige.png');
        this.menuTitleBG.anchor.set(0.5, 0.5);
        this.menuTitleBG.scale.setTo(1.6 , 1.3);
        
        this.menuTitleText = this.add.text(this.world.centerX, this.titleY, 'Menu', { 
            font: "30px Neucha", 
            fill: "#343434", 
            align: "center" });
        this.menuTitleText.anchor.set(0.5, 0.5);
    },
    
    setUpLevelUI: function () {
        this.levelTitleBG = this.add.sprite(this.world.centerX, this.levelUIY, 'menuAtlas', 'buttonLong_beige_pressed.png');
        this.levelTitleBG.anchor.set(0.5, 0.5);
        this.levelTitleBG.scale.setTo(1 , 1);
        
        this.levelTitleText = this.add.text(this.world.centerX,  this.levelUIY, '', { 
            font: "30px Neucha", 
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
                    this.levelTitleText.text = 'Level One';
                    break;
                    
                case 'city2.png':
                    this.levelTitleText.text = 'Level Two';
                    break;
                    
                default:
                    break;
            }
        } else {
            this.town = null;
            this.levelTitleText.text = '';
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
    },
    
    showStateText: function () {
        this.stateTextBG = this.add.sprite(this.world.centerX, this.world.centerY, 'menuAtlas', 'stateBg.png');
        this.stateTextBG.anchor.set(0.5, 0.5);
        
        this.stateText = this.add.text(this.world.centerX, this.world.centerY, player.state, { 
            font: "30px Neucha", 
            fill: "#343434", 
            align: "center" });
        this.stateText.anchor.set(0.5, 0.5);
        
        game.time.events.add(Phaser.Timer.SECOND*5, this.stopStateText, this);
    },
    
    stopStateText: function () {
        this.stateTextBG.visible = false;
        this.stateText.text = '';
    }
        
};
var player = {
    health: {
        max: 100,
        current: 100
    },
    
    gold: {
        max: 300,
        current: 50
    },
    
    state: 'none',
    
    reset: function (){
        this.health.current = this.health.max;
        this.gold.current = 50;
    },
    
    takeDamage: function (damage) {
        this.health.current -= damage;
        if (this.health.current <= 0) {
            game.state.getCurrentState().levelEnd('lose');
        }
    },
    
    addGold: function (change) {
       this.gold.current += change;
        if (this.gold.current > this.gold.max) {
            this.gold.current = this.gold.max;
        } 
    },
    
    spendGold: function (change) {
        if (change > this.gold.current){
            return false;
        } else {
            this.gold.current -= change;
            return true;
        }
    },
    
    setState: function (condition) {
        if (condition == 'win') {
            this.state = 'Congradulations, you completed the level!';
        }  else if (condition == 'lose') {
            this.state = 'Sorry, your base was destroyed, try again!';
        }
    }
};


function PlayerInfo (x, y, frame) {
    this.x = x;
    this.y = y;
    
    this.frame = frame;
    
    this.bg;
    
    this.offsetChunk = 25;
    
    this.bars = [];
};

PlayerInfo.prototype.initiate = function () {
    this.bg = game.add.image(this.x, this.y, 'menuAtlas', this.frame);
    this.bg.anchor.set(0.5, 0.5);
};

PlayerInfo.prototype.add = function (text, colour, value, offset) {
    var info = new InfoBar(this.x, this.y, text, colour, value);
    this.bars.push(info);
    var o = offset;
    info.createBar(o);
};

PlayerInfo.prototype.update = function () {
    for (var i = 0; i < this.bars.length; i++){
        this.bars[i].update();
    }
};

PlayerInfo.prototype.setValue = function (name, value) {
    for (var i = 0; i < this.bars.length; i++){
        if (this.bars[i].name === name){
            this.bars[i].value.current = value;
        }
    }
}


function Projectile (x, y, z, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.target;
    this.damage = 0;
};

Projectile.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.initiate = function () {
    this.kill();
    
    
};

Projectile.prototype.fire = function (x, y, damage, target) {    
    this.isoX = x;
    this.isoY = y;
    this.isoZ = 100;
    
    this.revive();
    
    this.damage = damage;
    this.target = target;
};

Projectile.prototype.update = function () {
    if (!this.target) {return;}
    
    var dx = this.target.isoX - this.isoX;
    var dy = this.target.isoY - this.isoY;
    var dz = 0 - this.isoZ;
    
    if (Math.sqrt(dx*dx + dy*dy) < 20) {
        this.kill();
        this.target.takeDamage(this.damage, dx, dy);
        this.target = null;
        return;
    }
    
    dx *= 0.04;
    dy *= 0.04;
    
    this.isoX += dx;
    this.isoY += dy;
    this.isoZ += dz;
    
    
};
        
        

function Spawner (state, x, y, z, frequency, startingHealth, size) {
    this.state = state;
    
    this.target;
    
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.timer;
    this.freq = frequency;
    this.max = 10;
    
    this.tower = true;
    
    this.enemyHealth = startingHealth;
    
    this.size = size;
    
    this.enemyGroup = [];
}

Spawner.prototype.initiate = function (target) {
    this.timer = game.time.events.loop(Phaser.Timer.SECOND*this.freq, this.spawn, this);
    
    this.target = target;
    
    this.createEnemies();
};

Spawner.prototype.createEnemies = function () {
    var enemy, i;
    for (i = 0; i < this.max; i++){
        enemy = new Enemy(this.x, this.y, this.z, 'batteringRamUp.png');
        enemy.initiate(this.target, this.state.pathfindingMap, this.state.map.tileGroup);
        game.physics.isoArcade.enable(enemy);
        enemy.isoZ *= this.size;
        enemy.anchor.set(0.5, -0.5);
        enemy.scale.setTo(this.size, 1);
        enemy.kill();
        
        this.enemyGroup.push(enemy);
    }
};

Spawner.prototype.spawn = function () {
    this.enemyHealth *= 1.10;
    
    var enemy = this.getEnemy();
    if (enemy) { 
        enemy.initiate(this.target, this.state.pathfindingMap); //Required to reset the pathfinder
        enemy.spawn(this.x, this.y, this.z, this.enemyHealth); 
    }
};

Spawner.prototype.getEnemy = function () {
    for (i = 0; i < this.max; i++){
        if (!this.enemyGroup[i].alive){
            return this.enemyGroup[i];
        }
    }
};

Spawner.prototype.addLiving = function (array) {
    for (i = 0; i < this.max; i++){
        if (this.enemyGroup[i].alive && !this.enemyGroup[i].dead){
            array.push(this.enemyGroup[i]);
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


var tileTowers = ['tower3.png', //1
                  'tower2.png', //2
                  'tower1.png', //3
                  'batteringRam1.png', //4
                  '', //5
                  '', //6
                  'city1.png', //7
                  'city2.png'];//8

var tileCities = [
    'city1.png',
    'city2.png'
];
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
        game.physics.isoArcade.setBounds(0, 0, 0, this.tileMap.length*71.5, this.tileMap.length*71.5, 1000);
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
                    switch (tileI%10) {
                        case 0:
                            spawner = new Spawner(game.state.getCurrentState(), x, y, 53, 3, 50, 1);
                            this.spawners.push(spawner);
                            break;
                        case 1:
                            spawner = new Spawner(game.state.getCurrentState(), x, y, 53, 7, 150, 1.2);
                            this.spawners.push(spawner);
                            break;
                            
                        default:
                            break;
                    }
                    
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
    
    this.tileGroup.forEach(this.updateTower, this, false);
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
        if (player.spendGold(towerList.get('cost'))) {
            var x = this.currentTile.tile.isoPosition.x;
            var y = this.currentTile.tile.isoPosition.y;
            var tower = new Tower(this, x, y, this.objectOffset+this.hoverOffset*2 , towerType);
            this.tileGroup.add(tower);
            tower.initiate();
            tower.anchor.set(0.5, 0.5);
            game.add.tween(tower).to({ isoZ: this.objectOffset+this.hoverOffset }, 200, Phaser.Easing.Quadratic.InOut, true);
            this.currentTile.tower = tower;
            player.spendGold(towerList.get('cost'));
            this.place = false;
        }
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

TileMap.prototype.updateTower = function (tile) {
    if(tile.tower){
        tile.update();
    }
};
function Tower (tileMap, x, y, z, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.tileMap = tileMap
    
    this.tower = true;
    this.cost = 100;
    
    this.name = '';
    this.damage = 0;
    this.attackSpeed = 0;
    this.cost = 0;
    this.range = 150;
    
    this.attackTimer;
    
    this.targets=[];
    
    this.projectile;
}

Tower.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.initiate = function () {
    this.name = towerList.get('name');
    this.damage = towerList.get('damage');
    this.attackSpeed = towerList.get('attackSpeed');
    this.cost = towerList.get('cost');
    
    this.attackTimer = game.time.events.loop(Phaser.Timer.SECOND*(60/this.attackSpeed), this.fire, this);
    
    this.projectile = new Projectile(this.isoX, this.isoY, this.isoZ, 'buttonRound_blue.png');
    this.tileMap.tileGroup.add(this.projectile);
    this.projectile.anchor.set(0.5, 0.5);
    this.projectile.scale.setTo(0.4, 0.4);
    this.projectile.initiate();
};

Tower.prototype.fire = function () {
    this.getTargets();
    
    var target = this.findTarget();
    
    if (!target) { return; }
    
    this.projectile.fire(this.isoX, this.isoY, this.damage, target);
    //game.add.tween(this.projectile).to({ isoX: target.isoX, isoY: target.isoY, isoZ:  0}, 100, Phaser.Easing.None, true);
};

Tower.prototype.getTargets = function () {
    this.targets.length = 0;
    this.tileMap.addLiving(this.targets);
};

Tower.prototype.findTarget = function () {
    if (this.targets.length === 0) { return null; }
    var ii = 0;
    var shortest = 10000;
    var current;
    for (var i = 0; i < this.targets.length; i++) {
        current = game.physics.isoArcade.distanceBetween(this, this.targets[i]);
        if (current < shortest) {
            shortest = current;
            ii = i;
        }
    }
    
    if (shortest < this.range) {
        return this.targets[ii];
    } else {
        return null;
    }
};

Tower.prototype.update = function () {
    if (this.projectile.alive) {
        this.projectile.update();
    }
};
var towerList = {
    currentIndex: 0,
    list: [],
    
    initiate: function () {
        this.list.push(new TowerType('Archer Tower', 70, 50, 50, 'tower3.png'));
        this.list.push(new TowerType('Mage Tower', 50, 90, 75, 'tower2.png'));
        this.list.push(new TowerType('Cannon Tower', 200, 35, 100, 'tower1.png'));
    },

    switchTower: function () {
        this.currentIndex++;
        this.currentIndex %= 3;
    },
    
    reset: function () {
        this.currentIndex = 0;
    },
    
    get: function (param) {
        return this.list[this.currentIndex][param];
    }
};
function TowerType (name, damage, aSpeed, cost, frame) {
    this.name = name;
    this.damage = damage;
    this.attackSpeed = aSpeed;
    this.cost = cost;
    this.frame = frame;
}
var game = new Phaser.Game(900, 670, Phaser.AUTO, 'test', null, true, false);

game.state.add('boot', stateManager.boot);
game.state.add('loading', stateManager.loading);
game.state.add('menu', stateManager.menu);
game.state.add('level1', stateManager.levelOne);
game.state.add('level2', stateManager.levelTwo);
//game.state.add('scoreScreen', stateManager.scoreScreen);

game.state.start('boot');