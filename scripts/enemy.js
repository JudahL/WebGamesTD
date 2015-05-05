function Enemy (x, y, z, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.enemy = true;
    
    this.pathfinder;
    this.map;
    
    this.path = [];
    this.currentNode = new TileVector(x/71.5, y/71.5);
    this.currentStep;
    
    this.target;
    
    this.moveTimer = game.time.create(false);
    this.deathTimer = game.time.create(false);
    
    //For pathfinding
    this.tilePos = {
        x: x/71.5,
        y: y/71.5
    };
    
    this.frames = {
        up: 'batteringRamUp.png',
        down: 'batteringRamDown.png',
        left: 'batteringRamLeft.png',
        right: 'batteringRamRight.png'
    };
    
    this.life = { //can't use 'health' as Phaser sprites already have a health property
        current: 100,
        max: 100
    };
    this.damage = 10;
    this.goldValue = 10;
    
    this.group;
    
    this.tween;
    
    this.dead = false;
}

Enemy.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.initiate = function (target, pfMap, group) {
    this.target = target;
    
    this.map = new AStarMap();
    this.pathfinder = new AStarPathfinder();
    
    this.map.initiate(pfMap);
    this.pathfinder.initiate(this.map);
    
    if (group) {
        this.group = group;
        this.group.add(this);
    }
};

Enemy.prototype.setUp = function (){
    this.path = this.pathfinder.findPath(this.tilePos.x, this.tilePos.y, this.target.x, this.target.y);
    
    this.currentStep = this.path.length - 1;
    
    this.moveTimer.loop(Phaser.Timer.SECOND, this.move, this);
    this.moveTimer.start();
};

Enemy.prototype.move = function () {
    this.currentStep--;
    
    if (this.currentStep < 0) { 
        player.takeDamage(10);
        this.suicide();
        return; 
    }
    
    this.currentNode = this.path[this.currentStep];
    
    this.changeFrame();
    
    this.tilePos.x = this.currentNode.x;
    this.tilePos.y = this.currentNode.y;
    
    this.updateWorldPos();
};

Enemy.prototype.updateWorldPos = function () {
    var isoX = this.tilePos.x*71.5;
    var isoY = this.tilePos.y*71.5;
    
    this.tween = game.add.tween(this).to({ isoX: isoX, isoY: isoY }, 1000, Phaser.Easing.Quadratic.InOut, true);
};

Enemy.prototype.changeFrame = function () {
    if (this.currentNode.x > this.tilePos.x) {
        this.frameName = this.frames.down; 
    } else if (this.currentNode.x < this.tilePos.x) {
        this.frameName = this.frames.up; 
    } else if (this.currentNode.y < this.tilePos.y) {
        this.frameName = this.frames.right; 
    } else if (this.currentNode.y > this.tilePos.y) {
        this.frameName = this.frames.left; 
    }
};

Enemy.prototype.spawn = function (x, y, z, updateLife) {  
    if (updateLife) { 
        this.life.max = updateLife;
    }
    this.dead = false;
    
    this.body.allowGravity = false;
    this.body.collideWorldBounds = false;
    this.body.reset(0, 0, 0);
    this.body.enable = false;
    
    this.isoX = x;
    this.isoY = y;
    this.isoZ = z;
    
    this.tilePos.x = this.isoX/71.5;
    this.tilePos.y = this.isoY/71.5;
    
    this.revive();
    
    this.life.current = this.life.max;
    
    this.setUp();
};

Enemy.prototype.takeDamage = function (damage, dx, dy) {
    if (this.dead) { return; }
    this.life.current -= damage;
    
    if (this.life.current < 0) {
        this.moveTimer.stop(true);
        this.tween.stop();
        this.isoZ = 90;
        this.knockback(dx, dy);
        this.dead = true;
        player.addGold(this.goldValue);
    }
};

Enemy.prototype.suicide = function () {
    this.kill();
    this.moveTimer.stop(true);
    this.tween.stop();
};

Enemy.prototype.knockback = function (dx, dy) {
    this.body.enable = true;
    this.body.allowGravity = true;
    this.body.gravity.setTo(0, 0, -700);
    this.body.velocity.setTo(dx*5, dy*5, 300);
    this.body.bounce.set(0.5, 0.5, 0.3);
    this.body.maxVelocity.setTo(300, 300, 300);
    this.body.deltaMax.setTo(20, 20, 20);
    
    this.deathTimer.add(Phaser.Timer.SECOND * 1, this.die, this);
    this.deathTimer.start();
};

Enemy.prototype.die = function () {
    this.deathTimer.stop();
    this.kill();
    this.body.allowGravity = false;
    this.body.reset(0, 0, 0);
    this.body.enable = false;
    this.body.bounce.set(0, 0, 0);
}