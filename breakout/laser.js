function Laser(x, y, i){
  Item.call(this, x, y, i, "laser")
}

Laser.prototype = Object.create(Item.prototype)
Laser.prototype.constructor = Laser

Laser.prototype.render = function(){
  noStroke()
  fill("red")
  rect(this.x, this.y, this.width, this.height)
}
