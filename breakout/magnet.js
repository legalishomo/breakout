var Item = require('./item')

// MAGNET POWERUP
function Magnet(x,y,i){
  Item.call(this, x, y, i, "magnet")
}

Magnet.prototype = Object.create(Item.prototype);
Magnet.prototype.constructor = Magnet

Magnet.prototype.render = function(){
  noStroke()
  fill("blue")
  rect(this.x, this.y, this.width, this.height)
}

module.exports = Magnet
