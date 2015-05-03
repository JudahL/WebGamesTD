function Node (xC, yC, xT, yT, totalSteps, parentNode) {
    this.x = xC;
    this.y = yC;
    this.g = totalSteps;
    this.h = this.manhattanDistance(xC, yC, xT, yT);
    this.f = totalSteps + this.manhattanDistance(xC, yC, xT, yT);
    this.parent = parentNode;
}

Node.prototype.manhattanDistance = function (xC, yC, xT, yT) {
    var dx = Math.abs(xT - xC), 
        dy = Math.abs(yT - yC);
    return dx + dy;
};