var towerList = {
    currentIndex: 0,
    list: [],
    
    initiate: function () {
        this.list.push(new TowerType('Archer Tower', 40, 60, 50, 'tower3.png'));
        this.list.push(new TowerType('Mage Tower', 20, 45, 125, 'tower2.png'));
        this.list.push(new TowerType('Cannon Tower', 80, 20, 200, 'tower1.png'));
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