// sets canvas pixel width and height to its css width and height
function resetCanvasSize() {
  let canvasStyle = getComputedStyle(canvas);
  
  let canvasWidth = parseInt(canvasStyle.width);
  let canvasHeight = parseInt(canvasStyle.height);
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}
