function Level (game, title, titleY, tileM, pathM, towerM) { 
    this.titleText = null;
    this.titleTextValue = title;
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
    this.towerInfo;
    
    this.playerHealth = 100;
    this.playerGold = 20;
    this.goldTimer;
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
};


    
Level.prototype.setUpTowerSelector = function () {
    this.currentTowerBG = game.add.image(this.world.centerX+380, this.titleY, 'menuAtlas', 'panel_beige.png');

    this.currentTowerBG.scale.setTo(1.3, 1.3);
    this.currentTowerBG.anchor.set(0.5, 0.5);

    this.currentTowerImage = game.add.image(this.world.centerX+380, this.titleY, 'towerAtlas', tileTowers[this.currentTowerIndex]);
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
    this.info = new PlayerInfo (this.world.centerX-230, this.titleY);
    this.info.initiate();

    this.info.add('Health','Green', 100);
    this.info.add('Gold', 'Yellow', 100); 
};

Level.prototype.setUpTowerInfo = function () {
    this.towerInfo = new PlayerInfo (this.world.centerX+230, this.titleY);
    this.towerInfo.initiate();

    this.towerInfo.add('Damage','Red', 100);
    this.towerInfo.add('Gold Cost', 'Yellow', 100);
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
    this.info.setValue('Health', this.playerHealth);
    this.info.setValue('Gold', this.playerGold);
};

Level.prototype.switchTower = function () {
    this.currentTowerIndex++;
    this.currentTowerIndex %= 3;
    this.currentTowerImage.frameName = tileTowers[this.currentTowerIndex];
};

Level.prototype.returnToMenu = function () {
    game.state.start('menu');
};        

Level.prototype.grantGold = function () {
    this.playerGold += 1;
    if (this.playerGold > 100) {
        this.playerGold = 100;
    }
}