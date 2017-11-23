
// ==========PADDLE SETUP
new p5();

const paddle_speed = 6
const paddle_full_width = 200
const paddle_edges_width = 25
const paddle_center_areas_width= 50
// 25 - 50 - 50 - 50 - 25
const paddle_height = 20
const canvas_width = 900;
const canvas_height = 700;
const paddle_start_x = 350 - (paddle_center_areas_width/2)

function Paddle(){
  this.x = paddle_start_x
  this.y = canvas_height - 40
  this.width = paddle_full_width
  this.height = paddle_height
  this.speed = paddle_speed
}

Paddle.prototype.display = function(){
  noStroke()
  fill("white")
  // rectMode(RADIUS) sets the x, y of rect() to now be the center point of the rectangle
  // and the w,h to be half of the rect()'s width and height
  rect(this.x-paddle_center_areas_width-paddle_edges_width, this.y, paddle_edges_width, this.height)
  rect(this.x-paddle_center_areas_width, this.y, paddle_center_areas_width, this.height)
  rect(this.x, this.y, paddle_center_areas_width, this.height)
  rect(this.x+paddle_center_areas_width, this.y, paddle_center_areas_width,this.height)
  rect(this.x+(paddle_center_areas_width*2), this.y, paddle_edges_width, this.height)
}

Paddle.prototype.moveLeft = function(){
  if(paddle.x <= (paddle_center_areas_width + paddle_edges_width)){
    paddle.x
  } else {
    paddle.x -= this.speed
  }
}

Paddle.prototype.moveRight = function(){
  if(paddle.x >= canvas_width - ((paddle_center_areas_width*2)+paddle_edges_width)){
    paddle.x
  }else{
    paddle.x += this.speed
  }
}


// ========BALL setup

const ball_start_x = 350
const ball_start_y = 700 - 55
const ball_radius = 11
var ball_change_x = 0
var ball_change_y = 10

  // ellipse(x,y,w,[h])
function Ball(x, y, radius){
  this.x = x
  this.y = y
  this.radius = radius
  this.diameter = radius * 2
  this.change_x = ball_change_x
  this.change_y = ball_change_y
  this.sqr_ball_change_x = ball_change_x**2
  this.sqr_ball_change_y = ball_change_y**2
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


// LINE USED TO CONNECT BALL TO PADDLE AND DETECT COLLISION FROM POINT TO POINT
function BallToPaddleLine(x1,y1, x2,y2){
  this.x1 = x1
  this.x2 = x2
  this.y1 = y1
  this.y2 = y2

}

BallToPaddleLine.prototype.render = function(){
  noStroke()
  line(this.x1, this.y1, this.x2, this.y2)
}

BallToPaddleLine.prototype.update = function(paddle_min_x, paddle_max_x, ball_x_pos, ball_y_pos, paddle, edge){
  this.x1 = ball_x_pos
  this.y1 = ball_y_pos
  if(ball_x_pos<=paddle_min_x){
    this.x2 = paddle_min_x
  }else if(ball_x_pos>=paddle_max_x){
    this.x2 = paddle_max_x
  }else{
    this.x2 = ball_x_pos
  }

  if(edge){
    if(ball_y_pos>=paddle.y){
      this.y2 = ball_y_pos
    }else{
      this.y2 = 700-40
    }
  }
}

// ===============BLOCK

var block_width = 93.75
var block_height = 30
  // rect(x, y, w, h)
function Block(x,y,i){
  this.x = x
  this.y = y
  this.width = block_width
  this.height = block_height
  this.perimeter_x = this.x
  this.perimeter_y = this.y + this.height
  this.index = i
  this.side_was_hit = false
  this.top_or_bottom_was_hit = false
  this.had_item = false
}

Block.prototype.display = function(){
  noStroke()
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

  let distance_between_points_LEFT = dist(ball.x, ball.y, this.x, side_y_value)
  let distance_between_points_RIGHT = dist(ball.x, ball.y, this.x+this.width, side_y_value)
  if( (distance_between_points_LEFT <= ball.radius || distance_between_points_RIGHT <= ball.radius) && !this.top_or_bottom_was_hit){
    this.side_was_hit = true
    console.log("hit side of block")
    return true
  }

}

Block.prototype.checkForTopBottomCollision = function(ball){
  let distance_between_points_TOP = dist(ball.x, ball.y, this.perimeter_x, this.y)
  let distance_between_points_BOTTOM = dist(ball.x, ball.y, this.perimeter_x, this.y+this.height)
  if((distance_between_points_BOTTOM <= ball.radius || distance_between_points_TOP <=ball.radius) && !this.side_was_hit){
    this.top_or_bottom_was_hit = true
    console.log("hit top or bottom of block")
    return true
  }
}



// =========UTILITY

// Implementing a 'nearest point' algorithm
function ballCollideWithPaddle(circle_x, circle_y, circle_radius, point_x, point_y){
  let distance_between_points = dist(circle_x, circle_y, point_x, point_y)
  if(distance_between_points <= circle_radius){
    return true
  }
}

function ballCollideWithWall(circle_axis, circle_radius, canvas_dimension){
  if(circle_axis-circle_radius <=0 || circle_axis >= canvas_dimension-circle_radius){
    return true
  }
}

function ballHitFloor(circle_y, circle_radius, canvas_height){
  if(circle_y + circle_radius >= canvas_height){
    return true
  }
}

function ballHitCeiling(circle_y, circle_radius){
  if(circle_y - circle_radius <= 0){
    return true
  }
}



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

  let distance_between_points_LEFT = dist(ball.x, ball.y, this.x, side_y_value)
  let distance_between_points_RIGHT = dist(ball.x, ball.y, this.x+this.width, side_y_value)
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
  let distance_between_points_TOP = dist(ball.x, ball.y, this.perimeter_x, this.y)
  let distance_between_points_BOTTOM = dist(ball.x, ball.y, this.perimeter_x, this.y+this.height)
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


// ===================ANGLE POINTER
const angle_pointer_start_x = 350
const angle_pointer_start_y = 500
const angle_pointer_start_angle = 90
const angle_pointer_length = dist(ball_start_x, ball_start_y, angle_pointer_start_x, angle_pointer_start_y)

function AnglePointer(){
  this.x = angle_pointer_start_x
  this.y = angle_pointer_start_y
  this.angle = angle_pointer_start_angle
  this.length = angle_pointer_length
}

AnglePointer.prototype.display = function(){
  stroke(220,220,220)
  strokeWeight(4)
  line(ball_start_x, ball_start_y, this.x, this.y)
}




// ==============GAME CLASS

// var hit_paddle = false
// var hit_block = false
// var start_position = true
// var ball_count = 4
// var game_over = false;
// var show_directions_on_start = true;

function Game(){
  this.blocks = {}
  this.score = 000
  this.level = 1
  this.start_position = true
  this.ball_count = 4
  this.game_over = false
  this.show_game_directions = true
  this.set_items_randomly = true
  this.items_indices = []
}

Game.prototype.restart = function(ball, paddle){
  ball.x = ball_start_x
  ball.y = ball_start_y
  paddle.x = paddle_start_x
}

Game.prototype.createBlocks = function(){
  let start_x = 40
  let start_y = 40
  let h_count = 0
  let margin = 10
  for(let i=0; i<40; i++){
    this.blocks[i] = new Block(start_x, start_y, i)
    start_x += (block_width + margin)
    h_count += 1
    if(h_count == 8){
      h_count = 0
      start_x = 40
      start_y += (block_height + margin)
    }
  }
}

Game.prototype.setStartPosition = function(angle_pointer){
  angle_pointer.display()
  fill(105,105,105)
  noStroke()
  ellipse(ball_start_x, ball_start_y, ball.radius + 10)
  ball.display()
  paddle.display()
  if(keyIsDown(65)){
    if(angle_pointer.angle>=165){
      return
    }else{
      angle_pointer.angle += 1
      let new_angle = (angle_pointer.angle) * (Math.PI / 180)
      let x_length = Math.cos(new_angle) * angle_pointer.length
      angle_pointer.x = 350 + x_length
      let y_length = Math.sin(new_angle) * angle_pointer.length
      angle_pointer.y = (500 +angle_pointer.length) - y_length
    }
  }
  if(keyIsDown(68)){
    if(angle_pointer.angle<=15){
      return
    } else{
      angle_pointer.angle -= 1
      let new_angle = (angle_pointer.angle) * (Math.PI/180)
      let x_length = Math.cos(new_angle) * angle_pointer.length
      angle_pointer.x = 350 + x_length
      let y_length = Math.sin(new_angle) * angle_pointer.length
      angle_pointer.y = (500+angle_pointer.length) - y_length
    }
  }
}

Game.prototype.subtractBall = function(){
  if(this.ball_count == 3){
    let ball1 = select('#ball-1')
    ball1.removeClass("ball")
  }else if(this.ball_count == 2){
    let ball2 = select('#ball-2')
    ball2.removeClass("ball")
  }else if(this.ball_count == 1){
    let ball3 = select('#ball-3')
    ball3.removeClass("ball")
  }
}

Game.prototype.gameOver = function(){
  let game_over_modal = document.getElementById('game-over-modal')
  game_over_modal.style.display = "flex";
  noLoop()
}

Game.prototype.resetBalls = function(){
  this.ball_count = 4
  let ball1 = select('#ball-1')
  let ball2 = select('#ball-2')
  let ball3 = select('#ball-3')
  ball1.addClass("ball")
  ball2.addClass("ball")
  ball3.addClass("ball")
}

Game.prototype.newGame = function(angle_pointer){
  this.start_position = true
  let game_over_modal = document.getElementById('game-over-modal')
  let score_board = document.getElementById("score-board")
  game_over_modal.style.display = "none";
  this.blocks = {}
  this.createBlocks()
  this.score = 0
  score_board.textContent = 0
  this.resetBalls()
  this.setStartPosition(angle_pointer)
}

Game.prototype.addPoints = function(){
  this.score += 3
  let score_board = document.getElementById("score-board")

  score_board.textContent = this.score
}

Game.prototype.completeFirstLevel = function(){
  this.level += 1
}

Game.prototype.generateRandomIndices = function(num){
  if(num > this.blocks){return -1}
  let num_blocks = Object.keys(this.blocks).length
  let random_indices = []
  while(random_indices.length < num){
    let random_idx = Math.floor(Math.random() * num_blocks)
    if(!random_indices.includes(random_idx)){
      random_indices.push(random_idx)
    }
  }
  return random_indices
}


// function that listens for keys pressed (NOT HELD)
function keyPressed(){
  if (keyCode == UP_ARROW && game.start_position == true){
    ball.change_y = -(sin(angle_pointer.angle) * ball.delta_distance)
    ball.change_x = cos(angle_pointer.angle) * ball.delta_distance
    game.start_position = false
  }

  if(keyCode == 67 && game.game_over == true){
    game.game_over = false
    game.newGame(angle_pointer)
    game.restart(ball, paddle)
    loop()
  }

  if(keyCode == 81 && game.game_over == true){
    game.game_over = false
    game.newGame(angle_pointer)
    game.restart(ball, paddle)
    loop()
    let canvas_area = document.getElementById('canvas-area')
    let start_modal = document.getElementById('modal');
    canvas_area.style.display = "none";
    start_modal.style.display = "flex";
  }

  if((keyCode == UP_ARROW) && game.show_game_directions){
    let infoModal = document.getElementById('info-modal')
    infoModal.style.display = "none";
    game.show_game_directions = false
  }

  if(level_two_boss.display_modal == true && (keyCode == 67 || keyCode == UP_ARROW)){
    let intro_modal = document.getElementById('level2-modal');
    intro_modal.style.display = "none";
  }

}


//===============MODAL LOGIC

const modal = document.getElementById('modal');
const canvas_area = document.getElementById('canvas-area')
const startButton = document.getElementById('start-button')
const infoButton = document.getElementById('info-button')
const infoModal = document.getElementById('info-modal')
const closeModalButton = document.getElementById("close-modal")

startButton.onclick = function(){
  modal.style.display = "none";
  canvas_area.style.display = "flex";
}

infoButton.onclick = function(){
  infoModal.style.display = "flex";
  game.show_game_directions = true
}

closeModalButton.onclick = function() {
    infoModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == infoModal) {
        infoModal.style.display = "none";
    }
}


// ==============SKETCH

const angle_pointer = new AnglePointer()
const game = new Game(angle_pointer)
const paddle = new Paddle()
const ball = new Ball(ball_start_x, ball_start_y, ball_radius)
const level_two_boss = new LevelTwoBoss(0, 100, 300, 150)
const ball_to_center_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_start_x, canvas_height-40)
const ball_to_LEFT_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_start_x-paddle_center_areas_width, canvas_height-40)
const ball_to_RIGHT_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_start_x+paddle_center_areas_width+1, canvas_height-40)
const ball_to_LCORNER_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_start_x-paddle_center_areas_width-paddle_edges_width, canvas_height-40)
const ball_to_RCORNER_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_start_x+(paddle_center_areas_width*2)+1, canvas_height-40)

game.createBlocks()

function setup() {
  // createCanvas(w,h)
  // 'height' is variable in P5 that is set to the canvas' height
  angleMode(DEGREES)
  let canvas = createCanvas(canvas_width, canvas_height)
  canvas.parent('canvas-holder');
}


// draw() continuously executes the code in the block until program stops
// to not loop, call noLoop() in the setUp() function
function draw() {
  // background(R, G, B)
  background(105,105,105)
  ball.hit_paddle = false
  ball.hit_block = false

  if(game.level == 1){

    if(game.set_items_randomly){
      game.items_indices = game.generateRandomIndices(4)
      game.set_items_randomly = false
    }
    // console.log(Object.values(game.blocks).length)
    Object.values(game.blocks).forEach((block)=>{
      block.display()
      block.side_was_hit = false
      block.top_or_bottom_was_hit = false
      block.renderCollisionDetectorLine(ball)
    })

    Object.values(game.blocks).some((block)=>{
      if(!ball.hit_block){
        if(block.checkForTopBottomCollision(ball)){
          ball.hit_block = true
          ball.changeBallYDirection()
          game.addPoints()
          block.remove(game)
          return true
        } else if(block.checkForSideCollisionWithBall(ball)){
          ball.hit_block = true
          ball.changeBallXDirection()
          game.addPoints()
          block.remove(game)
          return true
        }
      }
    })

    if(Object.keys(game.blocks).length==0){
      game.completeFirstLevel()
      game.restart(ball, paddle)
      game.resetBalls()
      game.start_position = true
    }

  }else if(game.level == 2){
    level_two_boss.side_was_hit = false
    level_two_boss.top_or_bottom_was_hit = false
    level_two_boss.move()
    level_two_boss.display()
    if(level_two_boss.setup == true){
      level_two_boss.display_life_points()
      level_two_boss.display_intro_modal()
    }
    level_two_boss.checkForHalfLife()
    level_two_boss.checkIfDefeated()
    level_two_boss.renderCollisionDetectorLine(ball)
    level_two_boss.checkForWallCollision()
    level_two_boss.checkForSideCollisionWithBall(ball)
    level_two_boss.checkForTopBottomCollision(ball)
  }

  if(game.start_position){
    game.setStartPosition(angle_pointer)
  }else{
    if(keyIsDown(LEFT_ARROW)){
      paddle.moveLeft()
    }

    if(keyIsDown(RIGHT_ARROW)){
      paddle.moveRight()
    }

    ball.update()
    ball_to_center_paddle_line.update(paddle.x, paddle.x + paddle_center_areas_width, ball.x, ball.y, paddle)
    ball_to_LEFT_paddle_line.update(paddle.x-paddle_center_areas_width, paddle.x -1, ball.x, ball.y, paddle)
    ball_to_RIGHT_paddle_line.update(paddle.x+paddle_center_areas_width+1, paddle.x+(paddle_center_areas_width*2), ball.x, ball.y, paddle)
    ball_to_LCORNER_paddle_line.update(paddle.x-paddle_center_areas_width-paddle_edges_width, paddle.x-paddle_center_areas_width-1, ball.x, ball.y, paddle, edge=true)
    ball_to_RCORNER_paddle_line.update(paddle.x+(paddle_center_areas_width*2)+1, paddle.x+(paddle_center_areas_width*2)+paddle_edges_width, ball.x, ball.y, paddle, edge=true)
    paddle.display()
    ball.display()
    ball_to_center_paddle_line.render()
    ball_to_LEFT_paddle_line.render()
    ball_to_RIGHT_paddle_line.render()
    ball_to_LCORNER_paddle_line.render()
    ball_to_RCORNER_paddle_line.render()


    // if ball hits left or right wall
    if(ballCollideWithWall(ball.x, ball.radius, canvas_width)){
      // console.log(ball.x)
      ball.changeBallXDirection()
    }

    // if ball hits ceiling
    if(ballHitCeiling(ball.y, ball.radius)){
      ball.changeBallYDirection()
    }

    // if ball hits floor
    if(ballHitFloor(ball.y, ball.radius, canvas_height) || ball.x < 0 || ball.x > canvas_width){
      game.restart(ball, paddle)
      game.ball_count -= 1
      game.subtractBall()
      game.start_position = true
      if(game.ball_count == 0){
        game.game_over = true
        game.gameOver()
      }
    }
    // IF BALL HITS CENTER AREA OF PADDLE
    if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_center_paddle_line.x2, ball_to_center_paddle_line.y2) && !ball.hit_paddle){
      ball.hit_paddle = true
      ball.changeBallYDirection()
      ball.changeBallAngle(90)
    }

    // IF BALL HITS CENTER, LEFT AREA OF PADDLE
    if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_LEFT_paddle_line.x2, ball_to_LEFT_paddle_line.y2) && !ball.hit_paddle){
      ball.hit_paddle = true
      ball.changeBallYDirection()
      ball.changeBallAngle(135)
    }

    // IF BALL HITS CENTER, RIGHT AREA OF PADDLE
    if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_RIGHT_paddle_line.x2, ball_to_RIGHT_paddle_line.y2) && !ball.hit_paddle){
      ball.hit_paddle = true
      ball.changeBallYDirection()
      ball.changeBallAngle(45)
    }

    // IF BALL HITS LEFT CORNER OF PADDLE
    if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_LCORNER_paddle_line.x2, ball_to_LCORNER_paddle_line.y2) && !ball.hit_paddle){
      ball.hit_paddle = true
      ball.changeBallYDirection()
      ball.changeBallAngle(150)
    }

    //  IF BALL HITS RIGHT CORNER OF PADDLE
    if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_RCORNER_paddle_line.x2, ball_to_RCORNER_paddle_line.y2) && !ball.hit_paddle){
      ball.hit_paddle = true
      ball.changeBallYDirection()
      ball.changeBallAngle(30)
    }

  }

}

// KEEP AN EYE OUT FOR CONFLICTS BETWEEN COLLISION DETECTION LOGIC WITH WALL
// AND THE CHANGE IN Y THAT BALL.CHANGEBALLANGLE PRODUCES. THE CHANGE IN Y
// COULD INVOKE THE ballCollideWithWall METHOD


// draw paddle
// get paddle to move by clicking right and left arrow keys
// get ball to appear
// get ball to bounce
// get ball to bounde off paddle
// HANDLE EDGE CASE: when ball hits edge of paddle
// add blocks
