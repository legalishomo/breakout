function AnglePointer(){
  this.x = constants.angle_pointer_start_x
  this.y = constants.angle_pointer_start_y
  this.angle = constants.angle_pointer_start_angle
  this.length = constants.angle_pointer_length
  this.render_for_magnet = false
}

AnglePointer.prototype.display = function(){
  stroke(220,220,220)
  strokeWeight(4)
  line(constants.ball_start_x, constants.ball_start_y, this.x, this.y)
}

AnglePointer.prototype.displayForMagnet = function(ball_x){
  stroke(220,220,220)
  strokeWeight(4)
  line(ball_x, constants.ball_start_y, this.x, this.y)
}
