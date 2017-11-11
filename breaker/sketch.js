
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
const ball_radius = 20
const ball_change_x = 0
const ball_change_y = 8
const start_position = true

function Ball(x, y, radius){
  this.x = x
  this.y = y
  this.radius = radius
  this.diameter = radius * 2
  this.change_x = ball_change_x
  this.change_y = ball_change_y
}

Ball.prototype.display = function(){
  noStroke()
  fill("white")
  ellipseMode(RADIUS)
  ellipse(this.x, this.y, this.radius)
}

Ball.prototype.update = function(){
  this.x += ball_change_x
  this.y += ball_change_y
}



// =========UTILITY

function ballCollideWithPaddle(circle_x, circle_y, circle_radius, point_x, point_y){
  let distance_between_points = dist(circle_x, circle_y, point_x, point_y)
  if(distance_between_points <= circle_radius){
    return true
  }
}

function ballCollideWithWall(circle_x, circle_y, circle_radius){
  if(circle_x-circle_radius <= 0 || circle_x+circle_radius >= width){
    return true
  }
}

function ballCollideWithCeiling(){
  
}

// ==============SKETCH

function setup() {
  // createCanvas(w,h)
  // 'height' is variable in P5 that is set to the canvas' height
  createCanvas(700, 700)
  paddle = new Paddle(paddle_x, height-40)
  ball = new Ball(ball_start_x, ball_start_y, ball_radius)
}

// draw() continuously executes the code in the block until program stops
// to not loop, call noLoop() in the setUp() function
function draw() {
  // rect(x, y, w, h)
  // ellipse(x,y,w,[h])
  // background(R, G, B)
  background(105,105,105)
  paddle.update()
  ball.update()
  paddle.display()
  ball.display()

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
  fill("red")
  ellipseMode(RADIUS)
  ellipse(mouseX, mouseY, 20)
  stroke("red")

  stroke("black")

  let lineX2
  if(mouseX<=paddle.x){
    lineX2 = paddle.x
  }else if(mouseX>=paddle.x+paddle_width-1){
    lineX2 = paddle.x + paddle_width-1
  }else{
    lineX2 = mouseX
  }

  let lineY2
  if(mouseY>=paddle.y){
    lineY2 = mouseY
  }else{
    lineY2 = paddle.y
  }

  line(mouseX, mouseY, lineX2, lineY2)

  if(ballCollideWithPaddle(mouseX, mouseY,20,lineX2,lineY2)){
    console.log("success")
  }

  if(ballCollideWithWall(mouseX,mouseY,20)){
    console.log("hitting wall")
  }


  // stroke("black")
  // point(mouseX, paddle.y)


  // // WALL LINES ( BORDER )
  // // line(x1, y1, x2, y2)
  // line(0,0,width,0)
  // line(0,0,0,height)
  // line(width,0,width,height)
  // line(0, height, width, height)
  //
  // ball_hit_left_wall = collideLineCircle(0,0,0,height,ball_x_pos, ball_y_pos, ball_diameter)
  // ball_hit_right_wall = collideLineCircle(width, 0, width, height, ball_x_pos, ball_y_pos, ball_diameter)
  // ball_hit_ceiling = collideLineCircle(0,0,width,0,ball_x_pos, ball_y_pos, ball_diameter)
  // ball_hit_floor = collideLineCircle(0, height, width, height, ball_x_pos, ball_y_pos, ball_diameter)
  // if(ball_hit_left_wall || ball_hit_right_wall){
  //   change_ball_x = -change_ball_x
  //   // console.log("hit wall")
  // }
  // if(ball_hit_ceiling || ball_hit_floor){
  //   change_ball_y = -change_ball_y
  // }
  //
  // // PADDLE LEFT, CENTER, RIGHT (SURFACE)
  //
  // stroke("red")
  // rect(paddle_x-60, height-40, paddle_width, 20)
  // rect(paddle_x+paddle_width, height-40, paddle_width, 20)
  // ball_hit_paddle_LEFT_surface = collideRectCircle(paddle_x-60, height-40, paddle_width, 20, ball_x_pos, ball_y_pos, ball_diameter)
  // ball_hit_paddle_RIGHT_surface = collideRectCircle(paddle_x+paddle_width, height-40, paddle_width, 20, ball_x_pos, ball_y_pos, ball_diameter)
  // ball_hit_paddle_CENTER_surface = collideRectCircle(paddle_x, height -40, paddle_width, 20, ball_x_pos, ball_y_pos, ball_diameter)
  //
  // // PADDLE CORNERS
  // rect(paddle_x-90, height -40, 30, 20)
  // rect(paddle_x + paddle_width+60, height -40, 30, 20)
  // ball_hit_LCorner_paddle = collideRectCircle(paddle_x-90, height -40, 30, 20,ball_x_pos, ball_y_pos, ball_diameter)
  // ball_hit_RCorner_paddle = collideRectCircle(paddle_x + paddle_width+90, height -40, 30, 20, ball_x_pos, ball_y_pos, ball_diameter)
  //
  // if(ball_hit_LCorner_paddle){
  //   console.log("hitLcorner")
  //   hit_any_side = true
  //   // ball_x_pos -=10
  //   // ball_y_pos -=10
  //   change_ball_y = -(change_ball_y)
  //   if(change_ball_x == 0){
  //     change_ball_x = -(change_ball_x+4)
  //   }else if(Math.sign(change_ball_x) == -1) {
  //     return
  //   }else{
  //     change_ball_x = -(change_ball_x)
  //   }
  //
  // }
  //
  // if(ball_hit_RCorner_paddle){
  //   console.log("hitRcorner")
  //   hit_any_side = true
  //   // ball_x_pos += 10
  //   // ball_y_pos -= 10
  //   change_ball_y = -(change_ball_y)
  //   if(change_ball_x == 0){
  //     change_ball_x = change_ball_x + 4
  //   } else if(Math.sign(change_ball_x) == 1){
  //     return
  //   } else {
  //     change_ball_x = -(change_ball_x)
  //   }
  // }
  //
  // if(ball_hit_paddle_LEFT_surface && !hit_any_side){
  //   hit_any_side = true
  //   console.log("hitLSurface")
  //   if(change_ball_x == 0){
  //     // change_ball_y = -(change_ball_y+4)
  //     change_ball_x = -(change_ball_x+4)
  //   }else if(Math.sign(change_ball_x) == -1) {
  //     change_ball_y = -(change_ball_y)
  //   }else{
  //     change_ball_y = -(change_ball_y)
  //     change_ball_x = -(change_ball_x)
  //   }
  // }
  //
  // if(ball_hit_paddle_RIGHT_surface && !hit_any_side){
  //   hit_any_side = true
  //   console.log("hitRsurface")
  //   if(change_ball_x ==0){
  //     // change_ball_y = -(change_ball_y+4)
  //     change_ball_x = change_ball_x + 4
  //   } else if(Math.sign(change_ball_x) == 1){
  //     change_ball_y = -(change_ball_y)
  //   } else{
  //     change_ball_y = -(change_ball_y)
  //     change_ball_x = -(change_ball_x)
  //   }
  // }
  //
  // if(!hit_any_side){
  //   if(ball_hit_paddle_CENTER_surface){
  //     console.log("hitpaddle")
  //     change_ball_y = -change_ball_y
  //   }
  // }
  //
  // ball_x_pos += change_ball_x
  // ball_y_pos += change_ball_y
  //
  // stroke("blue")
  // rect(paddle_x, height -40, paddle_width, 20)
  // ellipse(ball_x_pos, ball_y_pos, ball_diameter, ball_diameter)


}




// draw paddle
// get paddle to move by clicking right and left arrow keys
// get ball to appear
// get ball to bounce
// get ball to bounde off paddle
// HANDLE EDGE CASE: when ball hits edge of paddle
