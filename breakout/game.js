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
  paddle.x = constants.paddle_start_x
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
    angle_pointer.displayForMagnet(ball.x)
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

Game.prototype.newGame = function(angle_pointer, ball, paddle){
  this.start_position = true
  let game_over_modal = document.getElementById('game-over-modal')
  let score_board = document.getElementById("score-board")
  game_over_modal.style.display = "none";
  this.blocks = {}
  this.createBlocks()
  this.score = 0
  score_board.textContent = 0
  this.resetBalls()
  this.setStartPosition(angle_pointer, ball, paddle)
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
