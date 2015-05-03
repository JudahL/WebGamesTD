function Tower (game, x, y, z, key, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, key, frame);
    
    this.tower = true;
    this.cost = 100;
}

Tower.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Tower.prototype.constructor = Tower;