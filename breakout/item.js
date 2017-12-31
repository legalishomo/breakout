var constants = require('./constants')


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
