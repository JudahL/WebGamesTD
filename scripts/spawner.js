function Spawner (state, x, y, z, frequency) {
    this.state = state;
    
    this.target;
    
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.timer;
    this.freq = frequency;
    this.max = 10;
    
    this.tower = true;
    
    this.enemyGroup = [];
}

Spawner.prototype.initiate = function (target) {
    this.timer = game.time.events.loop(Phaser.Timer.SECOND*this.freq, this.spawn, this);
    
    this.target = target;
    
    this.createEnemies();
};

Spawner.prototype.createEnemies = function () {
    var enemy, i;
    for (i = 0; i < this.max; i++){
        enemy = new Enemy(this.x, this.y, this.z, 'batteringRamUp.png');
        enemy.initiate(this.target, this.state.pathfindingMap, this.state.map.tileGroup);
        enemy.anchor.set(0.5, -0.5);
        enemy.kill();
        
        this.enemyGroup.push(enemy);
    }
};

Spawner.prototype.spawn = function () {
    var enemy = this.getEnemy();
    if (enemy) { enemy.spawn(); }
};

Spawner.prototype.getEnemy = function () {
    for (i = 0; i < this.max; i++){
        if (!this.enemyGroup[i].alive){
            return this.enemyGroup[i];
        }
    }
};

Spawner.prototype.addLiving = function (array) {
    for (i = 0; i < this.max; i++){
        if (this.enemyGroup[i].alive){
            array.push(this.enemyGroup[i]);
        }
    }
};