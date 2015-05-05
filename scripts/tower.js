function Tower (tileMap, x, y, z, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.tileMap = tileMap
    
    this.tower = true;
    this.cost = 100;
    
    this.name = '';
    this.damage = 0;
    this.attackSpeed = 0;
    this.cost = 0;
    this.range = 150;
    
    this.attackTimer;
    
    this.targets=[];
    
    this.projectile;
}

Tower.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.initiate = function () {
    this.name = towerList.get('name');
    this.damage = towerList.get('damage');
    this.attackSpeed = towerList.get('attackSpeed');
    this.cost = towerList.get('cost');
    
    this.attackTimer = game.time.events.loop(Phaser.Timer.SECOND*(60/this.attackSpeed), this.fire, this);
    
    this.projectile = new Projectile(this.isoX, this.isoY, this.isoZ, 'buttonRound_blue.png');
    this.tileMap.tileGroup.add(this.projectile);
    this.projectile.anchor.set(0.5, 0.5);
    this.projectile.scale.setTo(0.4, 0.4);
    this.projectile.initiate();
};

Tower.prototype.fire = function () {
    this.getTargets();
    
    var target = this.findTarget();
    
    if (!target) { return; }
    
    this.projectile.fire(this.isoX, this.isoY, this.damage, target);
    //game.add.tween(this.projectile).to({ isoX: target.isoX, isoY: target.isoY, isoZ:  0}, 100, Phaser.Easing.None, true);
};

Tower.prototype.getTargets = function () {
    this.targets.length = 0;
    this.tileMap.addLiving(this.targets);
};

Tower.prototype.findTarget = function () {
    if (this.targets.length === 0) { return null; }
    var ii = 0;
    var shortest = 10000;
    var current;
    for (var i = 0; i < this.targets.length; i++) {
        current = game.physics.isoArcade.distanceBetween(this, this.targets[i]);
        if (current < shortest) {
            shortest = current;
            ii = i;
        }
    }
    
    if (shortest < this.range) {
        return this.targets[ii];
    } else {
        return null;
    }
};

Tower.prototype.update = function () {
    if (this.projectile.alive) {
        this.projectile.update();
    }
};