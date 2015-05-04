function Base (x, y, z, tilePos, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.tower = true;
    
    this.health = {
        current: 100,
        max: 100
    };
    
    this.tilePos = tilePos
}

Base.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Base.prototype.constructor = Base;

Base.prototype.getTilePos = function () {
    return this.tilePos;
};  