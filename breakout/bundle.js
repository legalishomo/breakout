/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const paddle_speed = 6
const paddle_full_width = 200
const paddle_edges_width = 25
const paddle_center_areas_width= 50
// 25 - 50 - 50 - 50 - 25
const paddle_height = 20
const canvas_width = 900;
const canvas_height = 700;
const paddle_start_x = 350 - (paddle_center_areas_width/2)

const ball_start_x = 350
const ball_start_y = 700 - 55
const ball_radius = 10
const ball_change_x = 0
const ball_change_y = 9

const block_width = 93.75
const block_height = 30

const item_width =  30
const item_height = 15
const item_change_y = 4

const angle_pointer_start_x = 350
const angle_pointer_start_y = 500
const angle_pointer_start_angle = 90
const angle_pointer_length = dist(ball_start_x, ball_start_y, angle_pointer_start_x, angle_pointer_start_y)

module.exports = {
  paddle_speed: paddle_speed,
  paddle_full_width: paddle_full_width,
  paddle_edges_width: paddle_edges_width,
  paddle_center_areas_width: paddle_center_areas_width,
  paddle_height: paddle_height,
  canvas_width: canvas_width,
  paddle_start_x: paddle_start_x,
  ball_start_x: ball_start_x,
  ball_start_y: ball_start_y,
  ball_radius: ball_radius,
  ball_change_x: ball_change_x,
  ball_change_y: ball_change_y,
  block_width: block_width,
  block_height: block_height,
  item_width: item_width,
  item_height: item_height,
  item_change_y: item_change_y,
  angle_pointer_start_x: angle_pointer_start_x,
  angle_pointer_start_y: angle_pointer_start_y,
  angle_pointer_start_angle: angle_pointer_start_angle,
  angle_pointer_length: angle_pointer_length
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(0)

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

module.exports = Block


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


// ==========PADDLE SETUP
new p5();

var constants = __webpack_require__(0)
var Paddle = __webpack_require__(3)
var Ball = __webpack_require__(4)
var BallToPaddleLine = __webpack_require__(5)
var Block = __webpack_require__(1)
var Magnet = __webpack_require__(6)
var LevelTwoBoss = __webpack_require__(8)
var AnglePointer = __webpack_require__(9)
var Game = __webpack_require__(10)
var Util = __webpack_require__(11)

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(0)

function Paddle(){
  this.x = constants.paddle_start_x
  this.y = constants.canvas_height - 40
  this.width = constants.paddle_full_width
  this.height = constants.paddle_height
  this.speed = constants.paddle_speed
  this.has_power_up = false
  this.power_up_type = null
  this.stroke_color = "black"
  this.edge_fills = "white"
  this.center_fills = "black"
}

Paddle.prototype.display = function(){
  strokeWeight(5)
  // stroke(this.stroke_color)
  fill(this.edge_fills)
  // rectMode(RADIUS) sets the x, y of rect() to now be the center point of the rectangle
  // and the w,h to be half of the rect()'s width and height
  rect(this.x-constants.paddle_center_areas_width-constants.paddle_edges_width, this.y, constants.paddle_edges_width, this.height)
  // stroke(this.stroke_color)
  fill(this.center_fills)
  rect(this.x-constants.paddle_center_areas_width, this.y, constants.paddle_center_areas_width, this.height)
  rect(this.x, this.y, constants.paddle_center_areas_width, this.height)
  rect(this.x+constants.paddle_center_areas_width, this.y, constants.paddle_center_areas_width,this.height)
  // stroke(this.stroke_color)
  fill(this.edge_fills)
  rect(this.x+(constants.paddle_center_areas_width*2), this.y, constants.paddle_edges_width, this.height)
}

Paddle.prototype.moveLeft = function(){
  if(paddle.x <= (constants.paddle_center_areas_width + constants.paddle_edges_width)){
    paddle.x
  } else {
    paddle.x -= this.speed
  }
}

Paddle.prototype.moveRight = function(){
  if(paddle.x >= constants.canvas_width - ((constants.paddle_center_areas_width*2)+constants.paddle_edges_width)){
    paddle.x
  }else{
    paddle.x += this.speed
  }
}

Paddle.prototype.add_power_up = function(item){
  this.has_power_up = true
  this.power_up_type = item
  if(item == "magnet"){
    this.center_fills = "blue"
  }
  setTimeout(()=>{
    this.center_fills = "black"
    this.has_power_up = false
    this.power_up_type = null
  }, 10000)
}

module.exports = Paddle


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(0)

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


module.exports = Ball


/***/ }),
/* 5 */
/***/ (function(module, exports) {

function BallToPaddleLine(x1,y1, x2,y2){
  this.x1 = x1
  this.x2 = x2
  this.y1 = y1
  this.y2 = y2

}

BallToPaddleLine.prototype.render = function(){
  noStroke()
  // stroke("black")
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

module.exports = BallToPaddleLine


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Item = __webpack_require__(7)

// MAGNET POWERUP
function Magnet(x,y,i){
  Item.call(this, x, y, i, "magnet")
}

Magnet.prototype = Object.create(Item.prototype);
Magnet.prototype.constructor = Magnet

Magnet.prototype.render = function(){
  noStroke()
  fill("blue")
  rect(this.x, this.y, this.width, this.height)
}

module.exports = Magnet


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(0)


function Item(x,y,i,type){
  this.x = x
  this.y = y
  this.width = constants.item_width
  this.height = constants.item_height
  this.change_y = constants.item_change_y
  this.reveal = false
  this.index  = i
  this.type = type
}

Item.prototype.checkForCollisionWithPaddle = function(paddle){
  let paddle_x = paddle.x - constants.constants.paddle_center_areas_width-constants.constants.paddle_edges_width
  if (this.x < paddle_x + paddle.width && this.x + this.width > paddle_x &&
   this.y < paddle.y + paddle.height && this.height + this.y > paddle.y) {
     console.log("item hit paddle")
     paddle.add_power_up(this.type)
     return true
  }
}

Item.prototype.checkIfHitFloor = function(){
  if(this.y+this.height >= constants.constants.canvas_height){
    return true
  }
}

Item.prototype.updatePosition = function(){
  if(this.reveal){
    this.y += this.change_y
  }
}

Item.prototype.removeFromGame = function(game){
  delete game.visible_items[this.index]
}


module.exports = Item


/***/ }),
/* 8 */
/***/ (function(module, exports) {

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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(0)

function AnglePointer(){
  this.x = constants.angle_pointer_start_x
  this.y = constants.angle_pointer_start_y
  this.angle = constants.angle_pointer_start_angle
  this.length = constants.angle_pointer_length
  this.render_for_magnet = false
}

AnglePointer.prototype.display = function(){
  stroke(220,220,220)
  strokeWeight(4)
  line(constants.ball_start_x, constants.ball_start_y, this.x, this.y)
}

AnglePointer.prototype.displayForMagnet = function(ball_x){
  stroke(220,220,220)
  strokeWeight(4)
  line(constants.ball_x, constants.ball_start_y, this.x, this.y)
}

module.exports = AnglePointer


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var constants = __webpack_require__(0);
var Block = __webpack_require__(1)

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
  this.visible_items = {}
}

Game.prototype.addItem = function(item){
  this.visible_items[item.index] = item
}

Game.prototype.restart = function(ball, paddle){
  ball.x = constants.ball_start_x
  ball.y = constants.ball_start_y
  paddle.x = constants.constants.paddle_start_x
}

Game.prototype.createBlocks = function(){
  let start_x = 40
  let start_y = 40
  let h_count = 0
  let margin = 10
  for(let i=0; i<40; i++){
    this.blocks[i] = new Block(start_x, start_y, i)
    start_x += (constants.block_width + margin)
    h_count += 1
    if(h_count == 8){
      h_count = 0
      start_x = 40
      start_y += (constants.block_height + margin)
    }
  }
}

Game.prototype.setStartPosition = function(angle_pointer, ball, paddle){
  let angle_start_x = constants.angle_pointer_start_x
  if(angle_pointer.render_for_magnet){
    angle_start_x = ball.x
    angle_pointer.displayForMagnet(ball_x)
  }else{
    angle_pointer.display()
  }

  fill(105,105,105)
  noStroke()
  ellipse(angle_start_x, constants.ball_start_y, ball.radius + 10)
  ball.display()
  paddle.display()
  if(keyIsDown(65)){
    if(angle_pointer.angle>=165){
      return
    }else{
      angle_pointer.angle += 1
      let new_angle = (angle_pointer.angle) * (Math.PI / 180)
      let x_length = Math.cos(new_angle) * angle_pointer.length
      angle_pointer.x = angle_start_x + x_length
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
      angle_pointer.x = angle_start_x + x_length
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
  this.items_indices = random_indices
  return random_indices
}

module.exports = Game


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// Implementing a 'nearest point' algorithm
var constants = __webpack_require__(0)


const Util = {
  ballCollideWithPaddle: function(ball, point_x, point_y){
    let distance_between_points = dist(ball.x, ball.y, point_x, point_y)
    if(dist(ball.x+ball.change_x, ball.y+ball.change_y, point_x, point_y) <= ball.radius){
      console.log(ball.x)
      console.log(ball.y)
      console.log(point_x)
      console.log(point_y)
      console.log(distance_between_points)
      console.log(ball.radius)
      console.log("greeater")
      return true
    }
  },
  ballCollideWithWall: function(ball, canvas_dimension){
    if((ball.x + ball.change_x)-ball.radius <=0 || (ball.x +ball.change_x)>= canvas_dimension-ball.radius){
      return true
    }
  },
  ballHitFloor: function(circle_y, circle_radius){
    if(circle_y + circle_radius >= constants.canvas_height){
      return true
    }
  },
  ballHitCeiling: function(circle_y, circle_radius){
    if(circle_y - circle_radius <= 0){
      return true
    }
  }
}

module.exports = Util


/***/ })
/******/ ]);