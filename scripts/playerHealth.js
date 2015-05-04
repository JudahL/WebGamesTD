function PlayerInfo (x, y) {
    this.x = x;
    this.y = y;
    
    this.bg;
    
    this.offsetChunk = 25;
    
    this.bars = [];
};

PlayerInfo.prototype.initiate = function () {
    this.bg = game.add.image(this.x, this.y, 'menuAtlas', 'healthPanel.png');
    this.bg.anchor.set(0.5, 0.5);
};

PlayerInfo.prototype.add = function (offset, text, colour, value) {
    var info = new InfoBar(this.x, this.y, offset, text, colour, value);
    this.bars.push(info);
    info.createBar((this.bars.length-1)*this.offsetChunk);
};

PlayerInfo.prototype.update = function () {
    for (var i = 0; i < this.bars.length; i++){
        this.bars[i].update();
    }
};

