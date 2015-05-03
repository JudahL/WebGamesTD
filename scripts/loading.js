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
        this.load.image('enemy1', 'images/enemy1.png');
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