
// ==========PADDLE SETUP
new p5();

var constants = require('./constants')
var Paddle = require('./paddle')
var Ball = require('./ball')
var BallToPaddleLine = require('./ballpaddle_line')
var Block = require('./block')
var Magnet = require('./magnet')
var LevelTwoBoss = require('./leveltwo_boss')
var AnglePointer = require('./angle_pointer')
var Game = require('./game')
var Util = require('./util')

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
const ball = new Ball(constants.ball_start_x, constants.ball_start_y, constants.ball_radius)
const level_two_boss = new LevelTwoBoss(0, 100, 300, 150)
const ball_to_center_paddle_line = new BallToPaddleLine(constants.ball_start_x, constants.ball_start_y, constants.paddle_start_x, constants.canvas_height-40)
const ball_to_LEFT_paddle_line = new BallToPaddleLine(constants.ball_start_x, constants.ball_start_y, constants.paddle_start_x-constants.paddle_center_areas_width, constants.canvas_height-40)
const ball_to_RIGHT_paddle_line = new BallToPaddleLine(constants.ball_start_x, constants.ball_start_y, constants.paddle_start_x+constants.paddle_center_areas_width+1, constants.canvas_height-40)
const ball_to_LCORNER_paddle_line = new BallToPaddleLine(constants.ball_start_x, constants.ball_start_y, constants.paddle_start_x-constants.paddle_center_areas_width-constants.paddle_edges_width, constants.canvas_height-40)
const ball_to_RCORNER_paddle_line = new BallToPaddleLine(constants.ball_start_x, constants.ball_start_y, constants.paddle_start_x+(constants.paddle_center_areas_width*2)+1, constants.canvas_height-40)

game.createBlocks()


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


function setup() {
  // createCanvas(w,h)
  // 'height' is a variable in P5 that is set to the canvas' height
  angleMode(DEGREES)
  debugger
  let canvas = createCanvas(constants.canvas_width, constants.canvas_height)
  canvas.parent('canvas-holder');
}

setup()


// draw() continuously executes the code in the block until program stops
// to not loop, call noLoop() in the setUp() function
function draw() {
  // background(R, G, B
  background(105,105,105)
  ball.hit_paddle = false
  ball.hit_block = false

  if(game.level == 1){

    if(game.set_items_randomly){
      game.items_indices = game.generateRandomIndices(4)
      // let index = 0
      Object.values(game.blocks).forEach((block)=>{
        if(game.items_indices.includes(block.index)){
          block.has_item = true
          // if(index%2 == 0){
            let magnet = new Magnet(block.x+(block.width/2), block.y+(block.height/2), block.index)
            block.addItem(magnet)
          // }
          // index += 1
        }
      })
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
          if(block.has_item){
            block.item.reveal = true
            game.addItem(block.item)
          }
          if(block.has_item){
            console.log("has item")
          }
          block.remove(game)
          return true
        } else if(block.checkForSideCollisionWithBall(ball)){
          ball.hit_block = true
          ball.changeBallXDirection()
          game.addPoints()
          block.remove(game)
          if(block.has_item){
            console.log("has item")
          }
          return true
        }
      }
    })

    if(Object.keys(game.blocks).length==0){
      game.completeFirstLevel()
      game.restart(ball, paddle)
      game.resetBalls()
      angle_pointer.x = constants.angle_pointer_start_x
      angle_pointer.y = constants.angle_pointer_start_y
      angle_pointer.angle = constants.angle_pointer_start_angle
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
    if(angle_pointer.render_for_magnet){
      game.setStartPosition(angle_pointer, ball, paddle)
    }else{
      game.setStartPosition(angle_pointer, ball, paddle)
    }
  }else{
    if(keyIsDown(LEFT_ARROW)){
      paddle.moveLeft()
    }

    if(keyIsDown(RIGHT_ARROW)){
      paddle.moveRight()
    }

    ball.update()
    ball_to_center_paddle_line.update(paddle.x, paddle.x + constants.paddle_center_areas_width, ball.x, ball.y, paddle)
    ball_to_LEFT_paddle_line.update(paddle.x-constants.paddle_center_areas_width, paddle.x -1, ball.x, ball.y, paddle)
    ball_to_RIGHT_paddle_line.update(paddle.x+constants.paddle_center_areas_width+1, paddle.x+(constants.paddle_center_areas_width*2), ball.x, ball.y, paddle)
    ball_to_LCORNER_paddle_line.update(paddle.x-constants.paddle_center_areas_width-constants.paddle_edges_width, paddle.x-constants.paddle_center_areas_width-1, ball.x, ball.y, paddle, edge=true)
    ball_to_RCORNER_paddle_line.update(paddle.x+(constants.paddle_center_areas_width*2)+1, paddle.x+(constants.paddle_center_areas_width*2)+constants.paddle_edges_width, ball.x, ball.y, paddle, edge=true)
    paddle.display()
    ball.display()
    ball_to_center_paddle_line.render()
    ball_to_LEFT_paddle_line.render()
    ball_to_RIGHT_paddle_line.render()
    ball_to_LCORNER_paddle_line.render()
    ball_to_RCORNER_paddle_line.render()

    let items_array = Object.values(game.visible_items)
    if(items_array.length != 0){
      items_array.forEach((item)=>{
        if(item.checkForCollisionWithPaddle(paddle) || item.checkIfHitFloor()){
          item.removeFromGame(game)
        }else{
          item.updatePosition()
          item.render()
        }
      })
    }

    // if ball hits left or right wall
    if(Util.ballCollideWithWall(ball, constants.canvas_width)){
      ball.changeBallXDirection()
    }

    // if ball hits ceiling
    if(Util.ballHitCeiling(ball.y, ball.radius)){
      ball.changeBallYDirection()
    }

    // if ball hits floor
    if(Util.ballHitFloor(ball.y, ball.radius, constants.canvas_height) || ball.x < 0 || ball.x > constants.canvas_width){
      game.restart(ball, paddle)
      game.ball_count -= 1
      game.subtractBall()
      game.start_position = true
      angle_pointer.x = constants.angle_pointer_start_x
      angle_pointer.y = constants.angle_pointer_start_y
      angle_pointer.angle = constants.angle_pointer_start_angle
      if(game.ball_count == 0){
        game.game_over = true
        game.gameOver()
      }
    }
    // IF BALL HITS CENTER AREA OF PADDLE
    if(Util.ballCollideWithPaddle(ball, ball_to_center_paddle_line.x2, ball_to_center_paddle_line.y2) && !ball.hit_paddle){
      if(paddle.has_power_up && paddle.power_up_type == "magnet"){
        ball.hit_paddle = true
        game.start_position = true
        angle_pointer.render_for_magnet = true
        angle_pointer.x = ball.x
        angle_pointer.y = constants.angle_pointer_start_y
        angle_pointer.angle = constants.angle_pointer_start_angle
      }else{
        angle_pointer.render_for_magnet = false
        ball.hit_paddle = true
        ball.changeBallYDirection()
        ball.changeBallAngle(90)
      }
    }

    // IF BALL HITS CENTER, LEFT AREA OF PADDLE
    if(Util.ballCollideWithPaddle(ball, ball_to_LEFT_paddle_line.x2, ball_to_LEFT_paddle_line.y2) && !ball.hit_paddle){
      if(paddle.has_power_up && paddle.power_up_type == "magnet"){
        ball.hit_paddle = true
        game.start_position = true
        angle_pointer.render_for_magnet = true
        angle_pointer.x = ball.x
        angle_pointer.y = constants.angle_pointer_start_y
        angle_pointer.angle = constants.angle_pointer_start_angle
      }else{
        angle_pointer.render_for_magnet = false
        ball.hit_paddle = true
        ball.changeBallYDirection()
        ball.changeBallAngle(135)
      }

    }

    // IF BALL HITS CENTER, RIGHT AREA OF PADDLE
    if(Util.ballCollideWithPaddle(ball, ball_to_RIGHT_paddle_line.x2, ball_to_RIGHT_paddle_line.y2) && !ball.hit_paddle){
      if(paddle.has_power_up && paddle.power_up_type == "magnet"){
        ball.hit_paddle = true
        game.start_position = true
        angle_pointer.render_for_magnet = true
        angle_pointer.x = ball.x
        angle_pointer.y = constants.angle_pointer_start_y
        angle_pointer.angle = constants.angle_pointer_start_angle
      }else{
        angle_pointer.render_for_magnet = false
        ball.hit_paddle = true
        ball.changeBallYDirection()
        ball.changeBallAngle(45)
      }
    }

    // IF BALL HITS LEFT CORNER OF PADDLE
    if(Util.ballCollideWithPaddle(ball, ball_to_LCORNER_paddle_line.x2, ball_to_LCORNER_paddle_line.y2) && !ball.hit_paddle){
        angle_pointer.render_for_magnet = false
        ball.hit_paddle = true
        ball.changeBallYDirection()
        ball.changeBallAngle(150)
    }

    //  IF BALL HITS RIGHT CORNER OF PADDLE
    if(Util.ballCollideWithPaddle(ball, ball_to_RCORNER_paddle_line.x2, ball_to_RCORNER_paddle_line.y2) && !ball.hit_paddle){
        angle_pointer.render_for_magnet = false
        ball.hit_paddle = true
        ball.changeBallYDirection()
        ball.changeBallAngle(30)
    }

  }

}

// exports.game = game
