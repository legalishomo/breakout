//=============LEVEL TWO BOSS

function LevelTwoBoss(x,y,w,h){
  this.lifepoints = 100
  this.x = x
  this.y = y
  this.width = w
  this.height = h
  this.change_x = 3
  this.side_hit_count = 0
  this.side_was_hit = false
  this.top_or_bottom_was_hit = false
  this.perimeter_x = this.x
  this.perimeter_y = this.y+this.height
  this.setup = true
  this.display_modal = true
}

LevelTwoBoss.prototype.display = function(){
  noStroke()
  fill("#CF284A")
  rect(this.x, this.y, this.width, this.height)
}

LevelTwoBoss.prototype.renderCollisionDetectorLine = function(ball){
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

LevelTwoBoss.prototype.move = function(){
  this.x += this.change_x
}

LevelTwoBoss.prototype.loseLife = function(){
  this.lifepoints -= 5
}

LevelTwoBoss.prototype.checkForWallCollision = function(){
  if(this.x >= width - this.width || this.x <= 0){
    this.change_x = -(this.change_x)
    this.side_hit_count = 0
  }
}

LevelTwoBoss.prototype.changeXDirection = function(){
  this.change_x = -(this.change_x)
}

LevelTwoBoss.prototype.subtractLifePoints = function(){
  let life_points_display = document.getElementById('score-board')
  this.lifepoints -=5
  life_points_display.textContent = this.lifepoints
}

LevelTwoBoss.prototype.checkForSideCollisionWithBall = function(ball){
  let side_y_value = this.perimeter_y
  if(this.perimeter_y == this.y+this.height){
    side_y_value = this.perimeter_y - 1
  } else if(this.perimeter_y == this.y){
    side_y_value = this.perimeter_y + 1
  }

  let distance_between_points_LEFT = dist(ball.x+ball.change_x, ball.y+ball.change_y, this.x, side_y_value)
  let distance_between_points_RIGHT = dist(ball.x+ball.change_x, ball.y+ball.change_y, this.x+this.width, side_y_value)
  if( (((distance_between_points_LEFT <= ball.radius) && (Math.sign(this.change_x) == -1)) || ((distance_between_points_RIGHT <= ball.radius) && (Math.sign(this.change_x) == 1))) && !this.top_or_bottom_was_hit){
    ball.changeBallXDirection()
    this.subtractLifePoints()
    this.side_was_hit = true
    if(this.side_hit_count == 0){
      this.changeXDirection()
      this.side_hit_count += 1
    }
  } else if( (((distance_between_points_LEFT <= ball.radius) && (Math.sign(this.change_x) == 1)) || ((distance_between_points_RIGHT <= ball.radius) && (Math.sign(this.change_x)==-1))) && !this.top_or_bottom_was_hit){
    ball.changeBallXDirection()
    this.side_was_hit = true
  }
}

LevelTwoBoss.prototype.checkForTopBottomCollision = function(ball){
  let distance_between_points_TOP = dist(ball.x + ball.change_x, ball.y+ball.change_y, this.perimeter_x, this.y)
  let distance_between_points_BOTTOM = dist(ball.x +ball.change_x, ball.y+ball.change_y, this.perimeter_x, this.y+this.height)
  if((distance_between_points_BOTTOM <= ball.radius || distance_between_points_TOP <=ball.radius) && !this.side_was_hit){
    ball.changeBallYDirection()
    this.subtractLifePoints()
    this.top_or_bottom_was_hit = true
  }
}

LevelTwoBoss.prototype.display_life_points = function(){
  this.setup = false
  let life_points_display = document.getElementById('score-board')
  life_points_display.textContent = this.lifepoints
}

LevelTwoBoss.prototype.checkIfDefeated = function(){
  if(this.lifepoints == 0){
    let you_won_modal = document.getElementById('you-won-modal')
    you_won_modal.style.display = "flex"
    noLoop()
  }
}

LevelTwoBoss.prototype.checkForHalfLife = function(){
  if(this.lifepoints == 50){
    this.change_x = Math.sign(this.change_x) == 1 ? 6 : -6
  }
}

LevelTwoBoss.prototype.display_intro_modal = function(){
  let intro_modal = document.getElementById('level2-modal')
  intro_modal.style.display = "flex"
}


module.exports = LevelTwoBoss
