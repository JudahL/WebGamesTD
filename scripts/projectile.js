function Projectile (x, y, z, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.target;
    this.damage = 0;
};

Projectile.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.initiate = function () {
    this.kill();
    
    
};

Projectile.prototype.fire = function (x, y, damage, target) {    
    this.isoX = x;
    this.isoY = y;
    this.isoZ = 100;
    
    this.revive();
    
    this.damage = damage;
    this.target = target;
};

Projectile.prototype.update = function () {
    if (!this.target) {return;}
    
    var dx = this.target.isoX - this.isoX;
    var dy = this.target.isoY - this.isoY;
    var dz = 0 - this.isoZ;
    
    if (Math.sqrt(dx*dx + dy*dy) < 20) {
        this.kill();
        this.target.takeDamage(this.damage, dx, dy);
        this.target = null;
        return;
    }
    
    dx *= 0.04;
    dy *= 0.04;
    
    this.isoX += dx;
    this.isoY += dy;
    this.isoZ += dz;
    
    
};
        
        
