var paddle_x = 250;
var MAX_X = 700;
var MIN_X = 0;
var speed = 10
var ball_x_pos = 100
var ball_y_pos = 100
var change_ball_x = 0
var change_ball_y = 4
var paddle_width = 200
var ball_diameter = 55
var animate = true
function setup() {
  // createCanvas(w,h)
  createCanvas(700, 700)
}

// draw() continuously executes the code in the block until program stops
// to not loop, call noLoop() in the setUp() function
function draw() {
  // rect(x, y, w, h)
  // background(R, G, B)
  background(105,105,105)
  noStroke()
  fill("white")
  annimate = true

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


  // WALL LINES ( BORDER )
  // line(x1, y1, x2, y2)
  line(0,0,width,0)
  line(0,0,0,height)
  line(width,0,width,height)
  line(0, height, width, height)

  ball_hit_left_wall = collideLineCircle(0,0,0,height,ball_x_pos, ball_y_pos, ball_diameter)
  ball_hit_right_wall = collideLineCircle(width, 0, width, height, ball_x_pos, ball_y_pos, ball_diameter)
  ball_hit_ceiling = collideLineCircle(0,0,width,0,ball_x_pos, ball_y_pos, ball_diameter)
  ball_hit_floor = collideLineCircle(0, height, width, height, ball_x_pos, ball_y_pos, ball_diameter)
  if(ball_hit_left_wall || ball_hit_right_wall){
    change_ball_x = -change_ball_x
    console.log("hit wall")
  }
  if(ball_hit_ceiling || ball_hit_floor){
    change_ball_y = -change_ball_y
  }

  // PADDLE LEFT AND RIGHT SIDES
  // collideRectRect(x, y, width, height, x2, y2, width2, height2 )
  // collideLineCircle(x1, y1, x2, y2, cx, cy, diameter)
  stroke("blue")
  line(paddle_x-5, height-45, paddle_x-5, height-20)
  // line(paddle_x-5, height-45, paddle_x+20, height-45)
  // ball_hit_LCorner_paddle = collideLineCircle(paddle_x-5, height-45, paddle_x+20, height-45, ball_x_pos, ball_y_pos, ball_diameter)
  line(paddle_x+paddle_width-1, height-40, paddle_x+paddle_width-1, height-20)
  ball_hit_Lside_paddle = collideLineCircle(paddle_x-5, height-40, paddle_x-5, height-20, ball_x_pos, ball_y_pos, ball_diameter)
  ball_hit_Rside_paddle = collideLineCircle(paddle_x+paddle_width-1, height-40, paddle_x+paddle_width-1, height-20, ball_x_pos, ball_y_pos, ball_diameter)
  stroke("red")
  line(paddle_x+10, height-45, paddle_x+paddle_width-1, height-45)
  ball_hit_paddle_surface = collideLineCircle(paddle_x+10, height-42, paddle_x+paddle_width-1, height-45, ball_x_pos, ball_y_pos, ball_diameter )
  // collideRectCircle(paddle_x, height-40, paddle_width, 20, ball_x_pos, ball_y_pos, ball_diameter, ball_diameter)
  stroke("green")
  // strokeWeight(10)
  // point(paddle_x-5, height-45)
  ellipse(paddle_x-5, height-45, 30, 30)
  strokeWeight(1)
  // ball_hit_LCorner_paddle = collidePointCircle(paddle_x-5, height-45,ball_x_pos, ball_y_pos, ball_diameter)
  ball_hit_LCorner_paddle = collideCircleCircle(paddle_x-5, height-45, 20, ball_x_pos, ball_y_pos, ball_diameter)

  if(ball_hit_LCorner_paddle){
    // ball_x_pos += change_ball_x
    // ball_y_pos += change_ball_y
    // ellipse(ball_x_pos-4, ball_y_pos-4, ball_diameter, ball_diameter)
    // console.log("hit")
    // change_ball_y = -(change_ball_y)
    // change_ball_x = -(change_ball_x)
    // ball_y_pos +=
    console.log("hit")
    ball_x_pos -=5
    ball_y_pos -=5
    change_ball_y = -(change_ball_y)
    if(change_ball_x == 0){
      change_ball_x = -(change_ball_x+5)
    }else if(Math.sign(change_ball_x) == -1) {
      return
    }else{
      change_ball_x = -(change_ball_x)
    }

    // annimate = false
    // ball_hit_LCorner_paddle = false
  }

  if(ball_hit_paddle_surface){
    console.log("hitpaddle")
    change_ball_y = -change_ball_y
  }
  // animation for ball
  // if(annimate){
    ball_x_pos += change_ball_x
    ball_y_pos += change_ball_y
  // }
  stroke("blue")
  rect(paddle_x, height -40, paddle_width, 20)
  ellipse(ball_x_pos, ball_y_pos, ball_diameter, ball_diameter)

  // console.log(ball_hit_Rside_paddle || ball_hit_Lside_paddle)
  // noStroke()

}







// draw paddle
// get paddle to move by clicking right and left arrow keys
// get ball to appear
// get ball to bounce
// get ball to bounde off paddle
// HANDLE EDGE CASE: when ball hits edge of paddle
