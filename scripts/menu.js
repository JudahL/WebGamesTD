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