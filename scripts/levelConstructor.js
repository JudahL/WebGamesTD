function Level (game, title, titleY, tileM, pathM, towerM) { 
    this.titleText = title;
    this.titleBG = null;
    this.titleY = titleY;
    this.map = null;
    this.tileMap = tileM;
    this.pathfindingMap = pathM;
    this.towerMap = towerM;
    
    this.currentTowerIndex = 0;
    this.currentTowerImage;
    this.maxTowers = 3;
    
    this.backButton = {
        arrow: null,
        button: null
    };
    
    this.info;
};

Level.prototype.create = function () { 
    game.input.deleteMoveCallback(0);

    this.map = new TileMap(71.5, 0);
    this.map.initiate(this.tileMap, this.towerMap);

    this.setUpTitle();
    this.setUpTowerSelector();
    this.setUpBackButton();
    this.setUpInfo();

    game.input.onDown.add(function (e) {
        this.map.place = true;
    }, this);

    game.input.onUp.add(function () {
        this.map.place = false;
    }, this);
};


    
Level.prototype.setUpTowerSelector = function () {
    this.currentTowerBG = game.add.image(this.world.centerX+380, this.titleY, 'menuAtlas', 'panel_beige.png');

    this.currentTowerBG.scale.setTo(1.3, 1.3);
    this.currentTowerBG.anchor.set(0.5, 0.5);

    this.currentTowerImage = game.add.image(this.world.centerX+380, this.titleY, 'towerAtlas', 'tower1.png');
    this.currentTowerImage.anchor.set(0.5, 0.5);

    this.currentTowerImage.inputEnabled = true;
    this.currentTowerImage.input.useHandCursor = true;
    this.currentTowerImage.events.onInputDown.add(this.switchTower, this);
};
    
Level.prototype.setUpBackButton = function () {
    this.backButton.button = game.add.button(this.world.centerX-250, this.titleY, 'menuAtlas', this.returnToMenu, this, 
                'buttonSquare_beige_pressed.png', 'buttonSquare_beige_pressed.png', 'buttonSquare_brown_pressed.png');

    this.backButton.button.scale.setTo(1.3, 1.3);
    this.backButton.button.anchor.set(0.5, 0.5);
    this.backButton.button.input.useHandCursor = true;

    this.backButton.arrow = game.add.image(this.world.centerX-250, this.titleY, 'menuAtlas', 'arrowBrown_left.png');
    this.backButton.arrow.anchor.set(0.5, 0.5);
};

Level.prototype.setUpTitle = function () {
    this.titleBG = this.add.sprite(this.world.centerX, this.titleY, 'menuAtlas', 'buttonLong_beige_pressed.png');
    this.titleBG.anchor.set(0.5, 0.5);
    this.titleBG.scale.setTo(1.2 , 1.2);

    this.titleText = this.add.text(this.world.centerX, this.titleY, this.titleText, { 
        font: "30px Neucha", 
        fill: "#343434", 
        align: "center" });
    this.titleText.anchor.set(0.5, 0.5);
};

Level.prototype.setUpInfo = function () {
    this.info = new PlayerInfo (this.world.centerX+230, this.titleY);
    this.info.initiate();

    this.info.add('Health','Green', 100);
    this.info.add('Gold', 'Yellow', 100); 
};


Level.prototype.update = function () {
    this.map.update();
    this.info.update();
};

Level.prototype.switchTower = function () {
    this.currentTowerIndex++;
    this.currentTowerIndex %= 3;
    this.currentTowerImage.frameName = tileTowers[this.currentTowerIndex];
};

Level.prototype.returnToMenu = function () {
    game.state.start('menu');
};        