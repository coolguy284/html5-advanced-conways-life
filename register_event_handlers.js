// register event listeners
addEventListener('load', () => {
  resetCanvasSize();
  
  // start the rendering frame loop
  //renderFrameLoop();
  renderFrame();
});

addEventListener('resize', () => {
  resetCanvasSize();
  renderFrame();
});

let mouseIsDown = false;
let pMouseX, pMouseY;

addEventListener('mousedown', () => {
  mouseIsDown = true;
});

addEventListener('mouseup', () => {
  mouseIsDown = false;
  pMouseX = null;
  pMouseY = null;
})

addEventListener('mousemove', evt => {
  if (mouseIsDown) {
    if (pMouseX != null && pMouseY != null) {
      let screenPixelsPerWorldUnit = getScreenPixelsPerWorldUnit();
      
      posX -= (evt.clientX - pMouseX) / screenPixelsPerWorldUnit;
      posY -= (evt.clientY - pMouseY) / screenPixelsPerWorldUnit;
    
      renderFrame();
    }
    
    pMouseX = evt.clientX;
    pMouseY = evt.clientY;
  }
});
