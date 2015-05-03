function AStarMap () {
    this.data = null;
}

AStarMap.prototype.initiate = function (data) {
    this.data = data;
};

AStarMap.prototype.outOfBounds = function (x, y) {
    return x < 0 || x >= this.data.length || y < 0 || y >= this.data.length;
};

AStarMap.prototype.blocked = function (x, y) {
    if (this.outOfBounds(x,y)) { return true; }
    if (this.data[y][x] === 0){ return true; }
    
    return false;
};

AStarMap.prototype.getNeighbors = function (x, y) {
    var neighbors = [];
    
    if (!this.blocked(x, y - 1)) { neighbors.push(new TileVector(x, y - 1)) }
    if (!this.blocked(x + 1, y)) { neighbors.push(new TileVector(x + 1, y)) }
    if (!this.blocked(x, y + 1)) { neighbors.push(new TileVector(x, y + 1)) }
    if (!this.blocked(x - 1, y)) { neighbors.push(new TileVector(x - 1, y)) }
        
    return neighbors;
};

AStarMap.prototype.getCost = function (x, y) {
    return this.data[y][x];
};

function TileVector (x, y) {
    this.x = x;
    this.y = y;
}