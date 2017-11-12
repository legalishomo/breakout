
// ==========PADDLE SETUP
var speed = 8
var paddle_x = 350;
var paddle_width = 60
const paddle_height = 20

function Paddle(x,y){
  this.x = x
  this.y = y
  this.width = paddle_width,
  this.height = paddle_height
}

Paddle.prototype.display = function(){
  noStroke()
  fill("white")
  // rectMode(RADIUS) sets the x, y of rect() to now be the center point of the rectangle
  // and the w,h to be half of the rect()'s width and height
  rect(this.x, this.y, this.width, this.height)
}

Paddle.prototype.update = function(){
  this.x = paddle_x
}

// ========BALL setup

const ball_start_x = 300
const ball_start_y = 300
const ball_radius = 10
var ball_change_x = 4
var sqr_ball_change_x = ball_change_x**2
var ball_change_y = 7
var sqr_ball_change_y = ball_change_y**2
var ball_delta_distance = Math.sqrt(sqr_ball_change_x+sqr_ball_change_y)

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
    debugger
    this.change_y = -new_change_y
    this.change_x = new_change_x
  } else{
    debugger
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
  stroke("black")
  line(this.x1, this.y1, this.x2, this.y2)
}

BallToPaddleLine.prototype.update = function(paddle, paddle_width, ball_x_pos, ball_y_pos){
  this.x1 = ball_x_pos
  this.y1 = ball_y_pos
  if(ball_x_pos<=paddle.x){
    this.x2 = paddle.x
  }else if(ball_x_pos>=paddle.x+paddle_width-1){
    this.x2 = paddle.x + paddle_width-1
  }else{
    this.x2 = ball_x_pos
  }

  if(ball_y_pos>=paddle.y){
    this.y2 = ball_y_pos
  }else{
    this.y2 = paddle.y
  }
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

var start_positon = true

function setup() {
  // createCanvas(w,h)
  // 'height' is variable in P5 that is set to the canvas' height
  angleMode(DEGREES)
  createCanvas(700, 700)
  paddle = new Paddle(paddle_x, height-40)
  ball = new Ball(ball_start_x, ball_start_y, ball_radius)
  // paddle_line = new BallToPaddleLine(mouseX, mouseY, paddle_x, height-40)
}

// draw() continuously executes the code in the block until program stops
// to not loop, call noLoop() in the setUp() function
function draw() {
  // rect(x, y, w, h)
  // ellipse(x,y,w,[h])
  // background(R, G, B)
  background(105,105,105)
  if(start_positon){

  }
  paddle.update()
  ball.update()
  // paddle_line.update(paddle, paddle_width, mouseX, mouseY)
  paddle.display()
  ball.display()
  // paddle_line.render()

  if(keyIsDown(LEFT_ARROW)){
    if(paddle_x == 0){
      paddle_x
    } else {
      paddle_x -= speed
    }
  }

  if(keyIsDown(RIGHT_ARROW)){
    if(paddle_x == 500){
      paddle_x
    }else{
      paddle_x += speed
    }
  }

  // if ball hits left or right wall
  if(ballCollideWithWall(ball.x, ball.radius, width)){
    console.log("hit l or r")
    ball.changeBallXDirection()
  }

  // if ball hits ceiling or floor
  if(ballCollideWithWall(ball.y, ball.radius, height)){
    console.log("hit f or c")
    ball.changeBallYDirection()
    ball.changeBallAngle(15)
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
