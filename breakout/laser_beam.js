function LaserBeam(x,y, side){
  this.x = x
  this.y = y
  this.width = constants.laser_beam_width
  this.height = 0
  this.side = side
}

LaserBeam.prototype.render = function(){
  // color fill
  // rect
  fill("red")
  rect(this.x, this.y, this.width, this.height)
}

LaserBeam.prototype.update = function(){
  this.y -= 10
  if(this.height != constants.laser_beam_height){
    this.height += 10
  }
}

LaserBeam.prototype.checkIfHitBlock = function(block){
  // collision detection for rectangle to rectangle
  if (this.x < block.x + constants.block_width && this.x + this.width > block.x &&
   this.y < block.y + constants.block_height && this.height + this.y > block.y) {
     return true
  }
}

LaserBeam.prototype.checkIfHitCeiling = function(){
  if(this.y + this.height < 0){
    return true
  }
}
