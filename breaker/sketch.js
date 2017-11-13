
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

const ball_start_x = 350
const ball_start_y = 700 - 55
const ball_radius = 11
var ball_change_x = 0
var sqr_ball_change_x = ball_change_x**2
var ball_change_y = 10
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
      this.y2 = height-40
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
  noStroke()
  fill("white")
  rect(this.x, this.y, this.width, this.height)
}

Block.prototype.wasHit = function(ball_x, ball_y, ball_diameter){
  return collideRectCircle(this.x, this.y, this.width, this.height, ball_x, ball_y, ball_diameter)
}

Block.prototype.remove = function(){
  delete blocks[this.index]
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

// ==============SKETCH

var hit_paddle = false
var blocks = {}
var start_position = true
var line_start_x = 350
var line_start_y = 500
var start_line_angle = 90
var start_line_length;

function restart(ball){
  ball.x = ball_start_x
  ball.y = ball_start_y
  paddle_x = 350 - (paddle_center_areas_width/2)
  paddle.x = paddle_x
  line_start_x = 350
  line_start_y = 500
  start_line_angle = 90
}

function setup() {
  // createCanvas(w,h)
  // 'height' is variable in P5 that is set to the canvas' height
  angleMode(DEGREES)
  var canvas = createCanvas(700, 700)
  canvas.parent('canvas-area');
  start_line_length = dist(ball_start_x, ball_start_y, line_start_x, line_start_y)

  paddle = new Paddle(paddle_x, height-40, paddle_full_width)
  ball = new Ball(ball_start_x, ball_start_y, ball_radius)
  ball_to_center_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x, height-40)
  ball_to_LEFT_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x-paddle_center_areas_width, height-40)
  ball_to_RIGHT_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x+paddle_center_areas_width+1, height-40)
  ball_to_LCORNER_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x-paddle_center_areas_width-paddle_edges_width, height-40)
  ball_to_RCORNER_paddle_line = new BallToPaddleLine(ball_start_x, ball_start_y, paddle_x+(paddle_center_areas_width*2)+1, height-40)

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

function keyPressed(){
  if (keyCode == SHIFT && start_position == true){
    ball.change_y = -(sin(start_line_angle) * ball_delta_distance)
    ball.change_x = cos(start_line_angle) * ball_delta_distance
    start_position = false
  }
}

// draw() continuously executes the code in the block until program stops
// to not loop, call noLoop() in the setUp() function
function draw() {
  // background(R, G, B)
  background(105,105,105)
  hit_paddle = false

  Object.values(blocks).forEach((block)=>{
    block.display()
  })

  Object.values(blocks).forEach((block)=>{
    if(block.wasHit(ball.x, ball.y, ball.diameter)){
      ball.changeBallYDirection()
      block.remove()
    }
  })

  if(start_position){
    stroke(220,220,220)
    strokeWeight(4)
    line(ball_start_x, ball_start_y, line_start_x, line_start_y)
    fill(105,105,105)
    noStroke()
    ellipse(ball_start_x, ball_start_y, ball.radius + 10)
    ball.display()
    paddle.display()
    if(keyIsDown(65)){
      if(start_line_angle>=165){
        return
      }else{
        start_line_angle += 1
        new_angle = (start_line_angle) * (Math.PI / 180)
        x_length = Math.cos(new_angle) * start_line_length
        line_start_x = 350 + x_length
        y_length = Math.sin(new_angle) * start_line_length
        line_start_y = (500 +start_line_length) - y_length
        console.log(start_line_angle)
      }
    }
    if(keyIsDown(68)){
      if(start_line_angle<=15){
        return
      } else{
        start_line_angle -= 1
        new_angle = (start_line_angle) * (Math.PI/180)
        x_length = Math.cos(new_angle) * start_line_length
        line_start_x = 350 + x_length
        y_length = Math.sin(new_angle) * start_line_length
        line_start_y = (500+start_line_length) - y_length
        console.log(start_line_angle)
      }
    }

  }else{
    paddle.update()
    ball.update()
    ball_to_center_paddle_line.update(paddle_x, paddle_x + paddle_center_areas_width, ball.x, ball.y)
    ball_to_LEFT_paddle_line.update(paddle_x-paddle_center_areas_width, paddle_x -1, ball.x, ball.y)
    ball_to_RIGHT_paddle_line.update(paddle_x+paddle_center_areas_width+1, paddle_x+(paddle_center_areas_width*2), ball.x, ball.y)
    ball_to_LCORNER_paddle_line.update(paddle_x-paddle_center_areas_width-paddle_edges_width, paddle_x-paddle_center_areas_width-1, ball.x, ball.y, edge=true)
    ball_to_RCORNER_paddle_line.update(paddle_x+(paddle_center_areas_width*2)+1, paddle_x+(paddle_center_areas_width*2)+paddle_edges_width, ball.x, ball.y, edge=true)
    paddle.display()
    ball.display()
    ball_to_center_paddle_line.render()
    ball_to_LEFT_paddle_line.render()
    ball_to_RIGHT_paddle_line.render()
    ball_to_LCORNER_paddle_line.render()
    ball_to_RCORNER_paddle_line.render()

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
      console.log(ball.x)
      ball.changeBallXDirection()
    }

    // if ball hits ceiling
    if(ballHitCeiling(ball.y, ball.radius)){
      ball.changeBallYDirection()
    }

    // if ball hits floor
    if(ballHitFloor(ball.y, ball.radius, height) || ball.x < 0 || ball.x > 700){
      restart(ball)
      start_position = true
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
