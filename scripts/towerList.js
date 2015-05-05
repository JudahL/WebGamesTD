var towerList = {
    currentIndex: 0,
    list: [],
    
    initiate: function () {
        this.list.push(new TowerType('Archer Tower', 70, 50, 50, 'tower3.png'));
        this.list.push(new TowerType('Mage Tower', 50, 90, 75, 'tower2.png'));
        this.list.push(new TowerType('Cannon Tower', 200, 35, 100, 'tower1.png'));
    },

    switchTower: function () {
        this.currentIndex++;
        this.currentIndex %= 3;
    },
    
    reset: function () {
        this.currentIndex = 0;
    },
    
    get: function (param) {
        return this.list[this.currentIndex][param];
    }
};