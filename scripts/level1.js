stateManager.levelOne = function (game) { 
    this.titleText = null;
    this.titleBG = null;
    this.titleY = 96;
    this.map = null;
    this.tileMap = [
        [0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 7, 2, 3, 0, 0],
        [2, 8, 0, 1, 0, 0],
        [0, 6, 2, 9, 2, 2],
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
};

stateManager.levelOne.prototype = {
    create: function () { 
        game.input.deleteMoveCallback(0);
        
        this.map = new TileMap(71.5, 0);
        this.map.initiate(this.tileMap, this.towerMap);
        this.map.spawnTiles(this.map.towerMap, 64, true);
        
        this.setUpTitle();
        
        game.input.onDown.add(function (e) {
            console.log(e);
            this.map.place = true;
        }, this);
        
        game.input.onUp.add(function () {
            this.map.place = false;
        }, this);
        
        this.currentTowerImage = game.add.image(this.world.centerX+300, this.world.centerY-150, 'towerAtlas', 'tower1.png');
        this.currentTowerImage.anchor.set(0.5, 0.5);
        
        this.currentTowerImage.inputEnabled = true;
        this.currentTowerImage.input.useHandCursor = true;
        this.currentTowerImage.events.onInputDown.add(this.switchTower, this);
    },
    
    setUpTitle: function () {
        this.titleBG = this.add.sprite(this.world.centerX, this.titleY, 'menuAtlas', 'panelInset_beige.png');
        this.titleBG.anchor.set(0.5, 0.5);
        this.titleBG.scale.setTo(3 , 0.7);
        
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
    }
        
};