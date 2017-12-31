// function that listens for keys pressed (NOT HELD)
function keyPressed(){
  if (keyCode == UP_ARROW && game.start_position == true){
    ball.change_y = -(sin(angle_pointer.angle) * ball.delta_distance)
    ball.change_x = cos(angle_pointer.angle) * ball.delta_distance
    game.start_position = false
  }

  if(keyCode == 67 && game.game_over == true){
    game.game_over = false
    game.newGame(angle_pointer, ball, paddle)
    game.restart(ball, paddle)
    loop()
  }

  if(keyCode == 81 && game.game_over == true){
    game.game_over = false
    game.newGame(angle_pointer, ball, paddle)
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
