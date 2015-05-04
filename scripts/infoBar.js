function InfoBar (x, y, text, colour, value) {
    this.x = x;
    this.y = y;
    
    this.bar = {
        text: text,
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
    
    bar.text = game.add.text(this.x, this.y+bar.offset, bar.text, { 
            font: "22px Neucha", 
            fill: "#343434", 
            align: "center" });
    bar.text.anchor.set(0.5, 0.5);
};

InfoBar.prototype.update = function () {
    this.bar.m.width = this.value.current * 150/100;
    this.bar.r.x = this.bar.m.x + this.bar.m.width;
};