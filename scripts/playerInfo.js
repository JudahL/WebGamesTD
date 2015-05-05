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

