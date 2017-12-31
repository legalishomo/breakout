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
