function AStarPathfinder () {
    this.map = null;
    this.closed = null;
    this.open = null;
    this.history = null;
    this.step = 0;
}

AStarPathfinder.prototype.initiate = function (map) {
    this.closed = [];
    this.open = [];
    this.history = [];
    this.map = map;
};

AStarPathfinder.prototype.addClosed = function (step) {
   // this.addHistory(step, 'closed');
    this.closed.push(step);
    return this;
};

AStarPathfinder.prototype.inClosed = function (step) {
    for (var i = 0; i < this.closed.length; i++) {
        if (this.closed[i].x === step.x 
            && this.closed[i].y === step.y) {
                return this.closed[i];
        }
    }
    
    return false;
};

AStarPathfinder.prototype.addOpen = function (step) {
    this.open.push(step);
    return this;
};

AStarPathfinder.prototype.removeOpen = function (step) {
    for (var i = 0; i < this.open.length; i++) {
        if (this.open[i] === step) { this.open.splice(i, 1); }
    }
    
    return this;
};

AStarPathfinder.prototype.inOpen = function (step) {
    for (var i = 0; i < this.open.length; i++) {
        if (this.open[i].x === step.x && this.open[i].y === step.y) {
            return this.open[i];
        }
    }
    
    return false;
};

AStarPathfinder.prototype.getBestOpen = function () {
    var bestI = 0;
    for (var i = 0; i < this.open.length; i++){
        if (this.open[i].f < this.open[bestI].f) { bestI = i; }
    }
    
    return this.open[bestI];
};

AStarPathfinder.prototype.findPath = function (xC, yC, xT, yT) {
    var current,
        neighbors,
        neighborRecord,
        stepCost,
        i;
    
    this.reset().addOpen(new Node(xC, yC, xT, yT, this.step, false));
    
    while (this.open.length !== 0) {
        this.step++;
        current = this.getBestOpen();
        
        if (current.x === xT && current.y === yT) {
            return this.buildPath(current, []);
        }
        
        this.removeOpen(current).addClosed(current);
        
        neighbors = this.map.getNeighbors(current.x, current.y);
        for (i = 0; i < neighbors.length; i++) {
            this.step++;
            
            stepCost = current.g + this.map.getCost(neighbors[i].x, neighbors[i].y);
            
            neighborRecord = this.inClosed(neighbors[i]);
            if (!neighborRecord || stepCost < neighborRecord.g) {
                if (!neighborRecord){
                    this.addOpen(new Node(neighbors[i].x, neighbors[i].y, xT, yT, stepCost, current));
                } else {
                    neighborRecord.parent = current;
                    neighborRecord.g = stepCost;
                    neighborRecord.f = stepCost + neighborRecord.h;
                }
            }        
        }
    }     
};

AStarPathfinder.prototype.buildPath = function (tile, stack) {
    stack.push(tile);
    
    if (tile.parent) {
        return this.buildPath(tile.parent, stack);
    } else {
        return stack;
    }
};

AStarPathfinder.prototype.reset = function () {
        this.closed = [];
        this.open = [];
        return this;
};

AStarPathfinder.prototype.test = function () {
    var map = new AStarMap();
    map.initiate(testMap);
    
    this.initiate(map);
    
    var path = this.findPath(0, 0, 0, 4);
    console.log(path);
};

var testMap = [
    [1, 0, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 0]
]