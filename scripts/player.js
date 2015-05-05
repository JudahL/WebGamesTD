var player = {
    health: {
        max: 100,
        current: 100
    },
    
    gold: {
        max: 300,
        current: 50
    },
    
    state: 'none',
    
    reset: function (){
        this.health.current = this.health.max;
        this.gold.current = 50;
    },
    
    takeDamage: function (damage) {
        this.health.current -= damage;
        if (this.health.current <= 0) {
            game.state.getCurrentState().levelEnd('lose');
        }
    },
    
    addGold: function (change) {
       this.gold.current += change;
        if (this.gold.current > this.gold.max) {
            this.gold.current = this.gold.max;
        } 
    },
    
    spendGold: function (change) {
        if (change > this.gold.current){
            return false;
        } else {
            this.gold.current -= change;
            return true;
        }
    },
    
    setState: function (condition) {
        if (condition == 'win') {
            this.state = 'Congradulations, you completed the level!';
        }  else if (condition == 'lose') {
            this.state = 'Sorry, your base was destroyed, try again!';
        }
    }
};

