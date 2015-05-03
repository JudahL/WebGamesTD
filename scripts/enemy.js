function Enemy (x, y, z, frame) {
    Phaser.Plugin.Isometric.IsoSprite.call(this, game, x, y, z, 'towerAtlas', frame);
    
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
}

Enemy.prototype = Object.create(Phaser.Plugin.Isometric.IsoSprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.initiate = function (target, pfMap) {
    this.target = target;
    
    this.map = new AStarMap();
    this.pathfinder = new AStarPathfinder();
    
    this.map.initiate(pfMap);
    this.pathfinder.initiate(this.map);
    
    this.path = this.pathfinder.findPath(this.tilePos.x, this.tilePos.y, this.target.x, this.target.y);
    
    this.currentStep = this.path.length - 1;
    
    this.moveTimer = game.time.events.loop(Phaser.Timer.SECOND, this.move, this);
    
    game.add.existing(this);
};

Enemy.prototype.move = function () {
    this.currentStep--;
    
    if (this.currentStep < 0) { return; }
    
    this.currentNode = this.path[this.currentStep];
    
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