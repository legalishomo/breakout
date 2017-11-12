
// ==========PADDLE SETUP
var speed = 6
var paddle_full_width = 200
var paddle_edges_width = 25
var paddle_center_areas_width= 50
// 20 - 50 - 50 - 50 - 20
var paddle_x = 350 - (paddle_center_areas_width/2)
const paddle_height = 20


function Paddle(x,y,width){
  this.x = x
  this.y = y
  this.width = width
  this.height = paddle_height
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

Paddle.prototype.update = function(){
  this.x = paddle_x
}


// ========BALL setup

const ball_start_x = 300
const ball_start_y = 300
const ball_radius = 10
var ball_change_x = 0
var sqr_ball_change_x = ball_change_x**2
var ball_change_y = 9
var sqr_ball_change_y = ball_change_y**2
var ball_delta_distance = Math.sqrt(sqr_ball_change_x+sqr_ball_change_y)

  // ellipse(x,y,w,[h])
function Ball(x, y, radius){
  this.x = x
  this.y = y
  this.radius = radius
  this.diameter = radius * 2
  this.change_x = ball_change_x
  this.change_y = ball_change_y
  this.delta_distance = ball_delta_distance
}

Ball.prototype.display = function(){
  noStroke()
  fill("white")
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

BallToPaddleLine.prototype.update = function(paddle_min_x, paddle_max_x, ball_x_pos, ball_y_pos, edge){
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
      this.y2 = paddle.y
    }
  }
}

// ===============BLOCK

var block_width = 116
var block_height = 50
  // rect(x, y, w, h)
function Block(x,y,w,h,i){
  this.x = x
  this.y = y
  this.width = w
  this.height = h
  this.index = i
}

Block.prototype.display = function(){
  fill("white")
  rect(this.x, this.y, this.width, this.height)
}

Block.prototype.remove = function(){
  blocks.splice(this.index, 1)
}


// =========UTILITY

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

// ==============SKETCH

var hit_paddle = false
var blocks = []

function setup() {
  // createCanvas(w,h)
  // 'height' is variable in P5 that is set to the canvas' height
  angleMode(DEGREES)
  createCanvas(700, 700)
  paddle = new Paddle(paddle_x, height-40, paddle_full_width)
  ball = new Ball(ball_start_x, ball_start_y, ball_radius)
  ball_to_center_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x, height-40)
  ball_to_LEFT_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x-paddle_center_areas_width, height-40)
  ball_to_RIGHT_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x+paddle_center_areas_width+1, height-40)
  ball_to_LCORNER_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x-paddle_center_areas_width-paddle_edges_width, height-40, edge=true)
  ball_to_RCORNER_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x+(paddle_center_areas_width*2)+1, height-40, edge=true)

  let start_x = 40
  let start_y = 40
  let h_count = 0
  let margin = 10
  for(i=0; i<20; i++){
    blocks[i] = new Block(start_x, start_y, block_width, block_height, i)
    start_x += (block_width + margin)
    h_count += 1
    if(h_count == 5){
      h_count = 0
      start_x = 40
      start_y += (block_height + margin)
    }
  }
}

// draw() continuously executes the code in the block until program stops
// to not loop, call noLoop() in the setUp() function
function draw() {
  // background(R, G, B)
  background(105,105,105)
  hit_paddle = false
  paddle.update()
  ball.update()
  ball_to_center_paddle_line.update(paddle_x, paddle_x + paddle_center_areas_width, ball.x, ball.y)
  ball_to_LEFT_paddle_line.update(paddle_x-paddle_center_areas_width, paddle_x -1, ball.x, ball.y)
  ball_to_RIGHT_paddle_line.update(paddle_x+paddle_center_areas_width+1, paddle_x+(paddle_center_areas_width*2), ball.x, ball.y)
  ball_to_LCORNER_paddle_line.update(paddle_x-paddle_center_areas_width-paddle_edges_width, paddle_x-paddle_center_areas_width-1, ball.x, ball.y)
  ball_to_RCORNER_paddle_line.update(paddle_x+(paddle_center_areas_width*2)+1, paddle_x+(paddle_center_areas_width*2)+paddle_edges_width, ball.x, ball.y)
  paddle.display()
  ball.display()
  ball_to_center_paddle_line.render()
  ball_to_LEFT_paddle_line.render()
  ball_to_RIGHT_paddle_line.render()
  ball_to_LCORNER_paddle_line.render()
  ball_to_RCORNER_paddle_line.render()

  blocks.forEach((block)=>{
    block.display()
  })



  if(keyIsDown(LEFT_ARROW)){
    if(paddle_x <= (paddle_center_areas_width + paddle_edges_width)){
      paddle_x
    } else {
      paddle_x -= speed
    }
  }

  if(keyIsDown(RIGHT_ARROW)){
    if(paddle_x >= width - ((paddle_center_areas_width*2)+paddle_edges_width)){
      paddle_x
    }else{
      paddle_x += speed
    }
  }

  // if ball hits left or right wall
  if(ballCollideWithWall(ball.x, ball.radius, width)){
    ball.changeBallXDirection()
  }

  // if ball hits ceiling or floor
  if(ballCollideWithWall(ball.y, ball.radius, height)){
    ball.changeBallYDirection()
  }

  // IF BALL HITS CENTER AREA OF PADDLE
  if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_center_paddle_line.x2, ball_to_center_paddle_line.y2) && !hit_paddle){
    hit_paddle = true
    ball.changeBallYDirection()
    ball.changeBallAngle(90)
  }

  // IF BALL HITS CENTER, LEFT AREA OF PADDLE
  if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_LEFT_paddle_line.x2, ball_to_LEFT_paddle_line.y2) && !hit_paddle){
    hit_paddle = true
    ball.changeBallYDirection()
    ball.changeBallAngle(135)
  }

  // IF BALL HITS CENTER, RIGHT AREA OF PADDLE
  if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_RIGHT_paddle_line.x2, ball_to_RIGHT_paddle_line.y2) && !hit_paddle){
    hit_paddle = true
    ball.changeBallYDirection()
    ball.changeBallAngle(45)
  }

  // IF BALL HITS LEFT CORNER OF PADDLE
  if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_LCORNER_paddle_line.x2, ball_to_LCORNER_paddle_line.y2) && !hit_paddle){
    hit_paddle = true
    ball.changeBallYDirection()
    ball.changeBallAngle(150)
  }

  //  IF BALL HITS RIGHT CORNER OF PADDLE
  if(ballCollideWithPaddle(ball.x, ball.y, ball.radius, ball_to_RCORNER_paddle_line.x2, ball_to_RCORNER_paddle_line.y2) && !hit_paddle){
    hit_paddle = true
    ball.changeBallYDirection()
    ball.changeBallAngle(30)
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
