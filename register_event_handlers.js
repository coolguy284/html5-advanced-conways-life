// register event listeners
addEventListener('load', () => {
  resetCanvasSize();
  
  // start the rendering frame loop
  renderFrameLoop();
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
      posY -= (evt.clientY - pMouseY) / -screenPixelsPerWorldUnit;
    
      renderFrame();
    }
    
    pMouseX = evt.clientX;
    pMouseY = evt.clientY;
  }
});

addEventListener('wheel', evt => {
  posScale = Math.min(Math.max(posScale * 10 ** -(evt.deltaY / SCROLL_INCREMENT_FACTOR), MIN_POS_SCALE), MAX_POS_SCALE);
  
  renderFrame();
});

addEventListener('keydown', evt => {
  switch (evt.key) {
    case ' ':
      simulationRunning = !simulationRunning;
      renderFrame();
      break;
    
    case 'r':
      conwaySim.resetSimulation();
      setInitialStateToArrayIfNeededOnReset();
      renderFrame();
      break;
    
    case 'd':
      if (timeSynced) {
        conwaySim.runOneTurn();
        renderFrame();
      } else {
        detatchedTimeValue++;
        renderFrame();
      }
      break;
    
    case 'a':
      if (timeSynced) {
        timeSynced = false;
        detatchedTimeValue = conwaySim.currentT - 1;
        renderFrame();
      } else {
        detatchedTimeValue--;
        renderFrame();
      }
      break;
    
    case 'f':
      if (timeSynced) {
        timeSynced = false;
        detatchedTimeValue = conwaySim.currentT;
      } else {
        timeSynced = true;
        detatchedTimeValue = null;
      }
      renderFrame();
      break;
    
    case 'n':
      if (debugTraversing) {
        debugTraversing = false;
        debugTraverser = null;
      } else {
        debugTraversing = true;
        debugTraverser = conwaySim.getBoardTraverser(0, 0, 0);
      }
      renderFrame();
      break;
    
    case 'i':
      if (debugTraversing) {
        debugTraverser = debugTraverser.moveUp();
        renderFrame();
      }
      break;
    
    case 'k':
      if (debugTraversing) {
        debugTraverser = debugTraverser.moveDown();
        renderFrame();
      }
      break;
    
    case 'j':
      if (debugTraversing) {
        debugTraverser = debugTraverser.moveLeft();
        renderFrame();
      }
      break;
    
    case 'l':
      if (debugTraversing) {
        debugTraverser = debugTraverser.moveRight();
        renderFrame();
      }
      break;
    
    case 'u':
      if (debugTraversing) {
        debugTraverser = debugTraverser.rotate(1);
        renderFrame();
      }
      break;
    
    case 'o':
      if (debugTraversing) {
        debugTraverser = debugTraverser.rotate(3);
        renderFrame();
      }
      break;
    
    case 'm':
      if (debugTraversing) {
        debugTraverser = debugTraverser.flipX();
        renderFrame();
      }
      break;
    
    case '.':
      if (debugTraversing) {
        debugTraverser = debugTraverser.flipY();
        renderFrame();
      }
      break;
  }
});
