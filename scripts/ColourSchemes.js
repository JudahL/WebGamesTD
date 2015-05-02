var colourSchemes = {
    colourParticles:function (item, colour) {
        var num = item.lifespan/item.parent.lifespan;
        colourSchemes[colour](item, num);
    },
    
    fire: function (item, num) {
        item.tint = '0xFF' + gradient.down(100, 20, num) + '00';
    },
    
    ice: function (item, num) {
        item.tint = '0x'+(20).toString(16) + gradient.down(150, 0, num) + (200).toString(16);
    },
    
    darkIce: function (item, num) {
        item.tint = '0x00' + gradient.up(40, 120, num) + (150).toString(16);
    },
    
    lightIce: function (item, num) {
        item.tint = '0x'+ (80).toString(16) + gradient.down(180, 100, num) + (200).toString(16);
    },
    
    arcane: function (item, num) {
        item.tint = '0x' + gradient.up(40, 220, num) + (60).toString(16) + (180).toString(16);
    },
    
    swamp: function (item, num) {
        item.tint = '0x00' + gradient.up(130, 250, num) + gradient.down(250, 0, num);
    },
    
    swampLight: function (item, num) {
        item.tint = '0x' + (80).toString(16) + gradient.down(250, 130, num) + gradient.up(70, 250, num);
    }
}

var gradient = {
    down: function (max, min, num) {
        return Math.round(Math.abs((num*(max-min))+min)).toString(16);
    },
    
    up: function (min, max, num) {
        return Math.round(Math.abs(max-(num*(max-min)))).toString(16);
    }
}