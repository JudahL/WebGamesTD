stateManager.levelOne = function (game) { 
    this.titleText = null;
    this.titleBG = null;
    this.titleY = 550;
    this.map = null;
    this.tileMap = [
        [ 0, 1, 0,11, 0,15],
        [ 0, 1, 0, 0, 0, 0],
        [14, 7, 2, 3, 0,13],
        [ 2, 8, 0, 1,14, 0],
        [ 0, 6, 2, 9, 2, 2],
        [ 0,16, 0, 0, 0,12]
    ];
    this.pathfindingMap = [
        [0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0],
        [1, 1, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0]
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
        this.setUpTowerSelector();
        this.setUpBackButton();
        
        game.input.onDown.add(function (e) {
            this.map.place = true;
        }, this);
        
        game.input.onUp.add(function () {
            this.map.place = false;
        }, this);
    },
    
    setUpTowerSelector: function () {
        this.currentTowerImage = game.add.image(this.world.centerX+300, this.titleY, 'towerAtlas', 'tower1.png');
        this.currentTowerImage.anchor.set(0.5, 0.5);
        
        this.currentTowerImage.inputEnabled = true;
        this.currentTowerImage.input.useHandCursor = true;
        this.currentTowerImage.events.onInputDown.add(this.switchTower, this);
    },
    
    setUpBackButton: function () {
        this.backButton.button = game.add.button(this.world.centerX-250, this.titleY, 'menuAtlas', this.returnToMenu, this, 
                                                 'buttonSquare_beige_pressed.png', 'buttonSquare_beige_pressed.png', 'buttonSquare_brown_pressed.png');
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
        
        
        var enemy = new Enemy (1*71.5, 0*71.5, 53, 'batteringRam1.png');
        enemy.initiate(new TileVector(5, 4), this.pathfindingMap, this.map.tileGroup);
        enemy.anchor.set(0.5, -0.5);
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