function Block(x,y,i){
  this.x = x
  this.y = y
  this.width = constants.block_width
  this.height = constants.block_height
  this.perimeter_x = this.x
  this.perimeter_y = this.y + this.height
  this.index = i
  this.side_was_hit = false
  this.top_or_bottom_was_hit = false
  this.has_item = false
  this.item = null
}

Block.prototype.display = function(){
  strokeWeight(6)
  stroke("black")
  fill("white")
  rect(this.x, this.y, this.width, this.height)
}

Block.prototype.wasHit = function(ball_x, ball_y, ball_diameter){
  return collideRectCircle(this.x, this.y, this.width, this.height, ball_x, ball_y, ball_diameter)
}

Block.prototype.remove = function(game){
  // console.log(Object.values(game.blocks))
  delete game.blocks[this.index]
  // console.log(Object.values(game.blocks))
}

Block.prototype.renderCollisionDetectorLine= function(ball){
  // stroke("black")
  // strokeWeight(1)
  noStroke()
  if(ball.x < this.x){
    this.perimeter_x = this.x
  } else if(ball.x >this.x+this.width){
    this.perimeter_x = this.x+this.width
  }else{
    this.perimeter_x = ball.x
  }

  if(ball.y < this.y){
    this.perimeter_y = this.y
  } else if (ball.y > this.y +this.height) {
    this.perimeter_y = this.y + this.height
  } else{
    this.perimeter_y = ball.y
  }
  line(ball.x, ball.y, this.perimeter_x, this.perimeter_y)
}

Block.prototype.checkForSideCollisionWithBall = function(ball){
  let side_y_value = this.perimeter_y
  if(this.perimeter_y == this.y+this.height){
    side_y_value = this.perimeter_y - 1
  } else if(this.perimeter_y == this.y){
    side_y_value = this.perimeter_y + 1
  }

  let distance_between_points_LEFT = dist(ball.x+ball.change_x, ball.y+ball.change_y, this.x, side_y_value)
  let distance_between_points_RIGHT = dist(ball.x+ball.change_x, ball.y+ball.change_y, this.x+this.width, side_y_value)
  if( (distance_between_points_LEFT <= ball.radius || distance_between_points_RIGHT <= ball.radius) && !this.top_or_bottom_was_hit){
    this.side_was_hit = true
    debugger
    return true
  }

}

Block.prototype.checkForTopBottomCollision = function(ball){
  let distance_between_points_TOP = dist(ball.x+ball.change_x, ball.y+ball.change_y, this.perimeter_x, this.y)
  let distance_between_points_BOTTOM = dist(ball.x+ball.change_x, ball.y+ball.change_y, this.perimeter_x, this.y+this.height)
  if((distance_between_points_BOTTOM <= ball.radius || distance_between_points_TOP <=ball.radius) && !this.side_was_hit){
    this.top_or_bottom_was_hit = true
    return true
  }
}

Block.prototype.addItem = function(item){
  this.item = item
}
