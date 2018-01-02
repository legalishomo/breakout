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
  this.left_laser_beams = []
  this.right_laser_beams = []
  this.interval_id = null
}

Paddle.prototype.display = function(){
  strokeWeight(5)
  stroke(this.stroke_color)
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
  if(!this.has_power_up){
    this.has_power_up = true
    this.power_up_type = item
    let interval_id;
    if(item == "magnet"){
      // this.center_fills = "blue"
      // this.stroke_color = "blue"
      this.edge_fills = "blue"
    }else if(item == "laser"){
      this.edge_fills = "red"
      this.interval_id = setInterval(function(){this.shootLaser()}.bind(this), 1000)
    }
    setTimeout(()=>{
      // this.center_fills = "black"
      // this.stroke_color = "black"
      this.edge_fills = "white"
      this.has_power_up = false
      this.power_up_type = null
      clearInterval(this.interval_id)
    }, 10000)
  }
}

Paddle.prototype.shootLaser = function(){
  let paddle_x = this.x - constants.paddle_center_areas_width-constants.paddle_edges_width

  let laser_left_x = ((paddle_x + (constants.paddle_edges_width / 2)) - (constants.laser_beam_width/2))

  let laser_right_x = ((paddle_x + constants.paddle_full_width) - (constants.paddle_edges_width/2)) - (constants.laser_beam_width/2)
  let left_laser_beam = new LaserBeam(laser_left_x, this.y, "left")
  let right_laser_beam = new LaserBeam(laser_right_x, this.y, "right")
  this.left_laser_beams.push(left_laser_beam)
  this.right_laser_beams.push(right_laser_beam)
}
