function Ball(x, y, radius){
  this.x = x
  this.y = y
  this.radius = radius
  this.diameter = radius * 2
  this.change_x = constants.ball_change_x
  this.change_y = constants.ball_change_y
  this.sqr_ball_change_x = (constants.ball_change_x)**2
  this.sqr_ball_change_y = (constants.ball_change_y)**2
  this.delta_distance = Math.sqrt(this.sqr_ball_change_x+this.sqr_ball_change_y)
  this.hit_paddle = false
  this.hit_block = false
}

Ball.prototype.display = function(){
  noStroke()
  fill("black")
  ellipseMode(RADIUS)
  ellipse(this.x, this.y, this.radius)
}

Ball.prototype.update = function(){
  this.x += this.change_x
  this.y += this.change_y
}

Ball.prototype.changeBallYDirection = function(){
  this.change_y = -(this.change_y)
}

Ball.prototype.changeBallXDirection = function(){
  this.change_x = -(this.change_x)
}

Ball.prototype.changeBallAngle = function(angle){
  let new_change_y = sin(angle) * this.delta_distance
  let new_change_x = cos(angle) * this.delta_distance
  if(Math.sign(this.change_y) == -1){
    this.change_y = -new_change_y
    this.change_x = new_change_x
  } else{
    this.change_y = new_change_y
    this.change_x = new_change_x
  }
}
