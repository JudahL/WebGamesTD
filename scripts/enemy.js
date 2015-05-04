function Enemy (x, y, z, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
    this.enemy = true;
    
    this.pathfinder;
    this.map;
    
    this.path = [];
    this.currentNode = new TileVector(x/71.5, y/71.5);
    this.currentStep;
    
    this.target;
    
    this.moveTimer;
    
    this.tilePos = {
        x: x/71.5,
        y: y/71.5
    };
    
    this.frames = {
        horizontal: 'batteringRamFlip.png',
        vertical: 'batteringRam1.png'
    };
    
    this.group
}

Enemy.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.initiate = function (target, pfMap, group) {
    this.target = target;
    
    this.map = new AStarMap();
    this.pathfinder = new AStarPathfinder();
    
    this.map.initiate(pfMap);
    this.pathfinder.initiate(this.map);
    
    this.path = this.pathfinder.findPath(this.tilePos.x, this.tilePos.y, this.target.x, this.target.y);
    
    this.currentStep = this.path.length - 1;
    
    this.moveTimer = game.time.events.loop(Phaser.Timer.SECOND, this.move, this);
    
    this.group = group;
    this.group.add(this);
};

Enemy.prototype.move = function () {
    this.currentStep--;
    
    if (this.currentStep < 0) { return; }
    
    this.currentNode = this.path[this.currentStep];
    
    this.changeFrame();
    
    console.log(this.currentNode);
    
    this.tilePos.x = this.currentNode.x;
    this.tilePos.y = this.currentNode.y;
    
    this.updateWorldPos();
};

Enemy.prototype.updateWorldPos = function () {
    var isoX = this.tilePos.x*71.5;
    var isoY = this.tilePos.y*71.5;
    
    game.add.tween(this).to({ isoX: isoX, isoY: isoY }, 1000, Phaser.Easing.Quadratic.InOut, true);
};

Enemy.prototype.changeFrame = function () {
    if (this.currentNode.x > this.tilePos.x || this.currentNode.x < this.tilePos.x) { 
        this.frameName = this.frames.horizontal; 
    } else {
        this.frameName = this.frames.vertical; 
    }
};