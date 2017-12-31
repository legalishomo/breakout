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
