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
