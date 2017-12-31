// Implementing a 'nearest point' algorithm
var constants = require('./constants')


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
