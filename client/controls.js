import { Game } from './game.js';

function Controls() {
    var self=this;
    document.onkeydown = function (e) { self.checkKey(e);}
}

Controls.prototype = {
	
	init : function(){
		var self=this;
		document.onkeydown = function (e) { self.checkKey(e);}
	},
	
    checkKey : function(e) {
        e = e || window.event;
        
        if (e.keyCode == 37){
            Game.move('left');
			return
		}
		if (e.keyCode == 38){
            Game.move('up');
			return
		}
		if (e.keyCode == 39){
            Game.move('right');
			return
		}
		if (e.keyCode == 40){
            Game.move('down');
			return
		}
		if (e.keyCode >= 49 && e.keyCode <= 52){
            Game.selectRobot(e.keyCode-49)
			return
		}
		if (e.keyCode == 82){
            Game.reset()
			return
		}
    }

}

export const Pad = new Controls()