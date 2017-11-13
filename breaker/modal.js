var modal = document.getElementById('modal')
var canvas_area = document.getElementById('canvas-area')
var startButton = document.getElementById('start-button')

startButton.onclick = function(){
  modal.style.display = "none";
  canvas_area.style.display = "flex";
}
