var player = {
    health: {
        max: 100,
        current: 100
    },
    
    gold: {
        max: 300,
        current: 20
    },
    
    reset: function (){
        this.health.current = this.health.max;
        this.gold.current = 20;
    },
    
    takeDamage: function (damage) {
        this.health.current -= damage;
    }
};

