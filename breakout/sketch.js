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

function setup() {
  angleMode(DEGREES)
  let canvas = createCanvas(constants.canvas_width, constants.canvas_height)
  canvas.parent('canvas-holder');
}


// draw() continuously executes the code in the block until program stops
// to not loop, call noLoop() in the setUp() function
function draw() {
  // background(R, G, B
  background(105,105,105)
  ball.hit_paddle = false
  ball.hit_block = false

  if(game.level == 1){

    // assign items to random blocks
    if(game.set_items_randomly){
      game.items_indices = game.generateRandomIndices(10)
      let index = 0
      Object.values(game.blocks).forEach((block)=>{
        if(game.items_indices.includes(block.index)){
          block.has_item = true
          if(index%2 == 0){
            let magnet = new Magnet(block.x+(block.width/2), block.y+(block.height/2), block.index)
            block.addItem(magnet)
          }else{
            let laser = new Laser(block.x+(block.width/2), block.y+(block.height/2), block.index)
            block.addItem(laser)
          }
          index += 1
        }
      })
      game.set_items_randomly = false
    }

    // reset block defaults and redraw
    Object.values(game.blocks).forEach((block)=>{
      block.display()
      block.side_was_hit = false
      block.top_or_bottom_was_hit = false
      block.renderCollisionDetectorLine(ball)
    })

    // check if any one of the blocks is hit by the ball
    // once any returns true, execution of the block of code ends
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
          block.remove(game)
          return true
        } else if(block.checkForSideCollisionWithBall(ball)){
          ball.hit_block = true
          ball.changeBallXDirection()
          game.addPoints()
          if(block.has_item){
            block.item.reveal = true
            game.addItem(block.item)
          }
          block.remove(game)
          return true
        }
      }
    })

    // check to see if level 1 is complete
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


  // animate falling items (movement = falling)
  // check to see if item touches paddle
  let items_array = Object.values(game.visible_items)
  if(items_array.length != 0){
    items_array.forEach((item)=>{
      // item.checkForCollisionWithPaddle adds power up to paddle if it returns true
      if(item.checkForCollisionWithPaddle(paddle) || item.checkIfHitFloor()){
        item.removeFromGame(game)
      }else{
        item.updatePosition()
        item.render()
      }
    })
  }

  // animate/update left and right laser beams
  if(paddle.left_laser_beams.length != 0){
    paddle.left_laser_beams.forEach((laser_beam)=>{
      laser_beam.render()
      laser_beam.update()
    })
  }

  if(paddle.right_laser_beams.length != 0){
    paddle.right_laser_beams.forEach((laser_beam)=>{
      laser_beam.render()
      laser_beam.update()
    })
  }

  // check to see if any laser beam hits any block
  Object.values(game.blocks).forEach((block)=>{
    if(paddle.left_laser_beams.length != 0){
      if(paddle.left_laser_beams[0].checkIfHitBlock(block)){
        // remove block from game
        block.remove(game)
        paddle.left_laser_beams.shift()
      }else if(paddle.left_laser_beams[0].checkIfHitCeiling()){
        paddle.left_laser_beams.shift()
      }
    }
    if(paddle.right_laser_beams.length != 0){
      if(paddle.right_laser_beams[0].checkIfHitBlock(block)){
        block.remove(game)
        paddle.right_laser_beams.shift()

      }else if(paddle.right_laser_beams[0].checkIfHitCeiling()){
        paddle.right_laser_beams.shift()
      }
    }
  })




  // check to see if we need to be in starting position (with angle pointer)
  if(game.start_position){
    game.setStartPosition(angle_pointer, ball, paddle)
  }else{
    // keys to move paddle
    if(keyIsDown(LEFT_ARROW)){
      paddle.moveLeft()
    }

    if(keyIsDown(RIGHT_ARROW)){
      paddle.moveRight()
    }

    // update assets
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
      // remove visible items from game
      let current_items = Object.values(game.visible_items)
      if(current_items.length != 0){
        current_items.forEach((item)=>{
          item.removeFromGame(game)
        })
      }

      // remove any current power ups that the player has
      paddle.edge_fills = "white"
      paddle.has_power_up = false
      if(paddle.power_up_type == "laser"){
        clearInterval(paddle.interval_id)
        paddle.interval_id = null
      }
      paddle.power_up_type = null

      if(game.ball_count == 0){
        game.game_over = true
        game.gameOver()
      }
    }


    // IF BALL HITS CENTER AREA OF PADDLE
    if(Util.ballCollideWithPaddle(ball, ball_to_center_paddle_line.x2, ball_to_center_paddle_line.y2) && !ball.hit_paddle){
      // check to see if paddle currently has a power up type "magnet"
      if(paddle.has_power_up && paddle.power_up_type == "magnet"){
        ball.y = constants.ball_start_y
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
      // check to see if paddle currently has a power up type "magnet"
      if(paddle.has_power_up && paddle.power_up_type == "magnet"){
        ball.y = constants.ball_start_y
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
      // check to see if paddle currently has a power up type "magnet"
      if(paddle.has_power_up && paddle.power_up_type == "magnet"){
        ball.y = constants.ball_start_y
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
