var modal = document.getElementById('modal');
var canvas_area = document.getElementById('canvas-area')
var startButton = document.getElementById('start-button')
var infoButton = document.getElementById('info-button')
var infoModal = document.getElementById('info-modal')
var closeModalButton = document.getElementById("close-modal")

startButton.onclick = function(){
  modal.style.display = "none";
  canvas_area.style.display = "flex";
}

infoButton.onclick = function(){
  console.log("clicked")
  infoModal.style.display = "flex";
}

closeModalButton.onclick = function() {
    infoModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == infoModal) {
        infoModal.style.display = "none";
    }
}
