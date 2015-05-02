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