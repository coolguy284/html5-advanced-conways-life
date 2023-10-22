function getScreenPixelsPerWorldUnit() {
  return canvas.height * posScale;
}

function worldSpaceToScreenSpace(x, y) {
  let screenPixelsPerWorldUnit = getScreenPixelsPerWorldUnit();
  
  return [
    canvas.width / 2 + (x - posX) * screenPixelsPerWorldUnit,
    canvas.height / 2 + (y - posY) * -screenPixelsPerWorldUnit,
  ];
}

function screenSpaceToWorldSpace(x, y) {
  let screenPixelsPerWorldUnit = getScreenPixelsPerWorldUnit();
  
  return [
    (x - canvas.width / 2) / screenPixelsPerWorldUnit + posX,
    (y - canvas.height / 2) / -screenPixelsPerWorldUnit + posY,
  ];
}

// draws the conway's game of life grid onto the string
function drawConways(ctx) {
  // grid vars
  let squareSize = getScreenPixelsPerWorldUnit();
  let worldSpaceScreenWidth = 1 / posScale * (canvas.width / canvas.height);
  let worldSpaceScreenHeight = 1 / posScale;
  let worldSpaceStartX = Math.floor(posX - (worldSpaceScreenWidth / 2));
  let worldSpaceEndX = Math.ceil(posX + (worldSpaceScreenWidth / 2));
  let worldSpaceStartY = Math.floor(posY - (worldSpaceScreenHeight / 2));
  let worldSpaceEndY = Math.ceil(posY + (worldSpaceScreenHeight / 2));
  
  // draw whether each cell is filled in or not
  for (let j = worldSpaceStartY; j <= worldSpaceEndY; j++) {
    for (let i = worldSpaceStartX; i <= worldSpaceEndX; i++) {
      if (conwaySim.boardState.getStateAt(i, j, conwaySim.currentT)) {
        ctx.fillStyle = 'white';
        ctx.fillRect(
          ...worldSpaceToScreenSpace(i - 0.5, j + 0.5),
          squareSize, squareSize
        );
      }
    }
  }
  
  // set line drawing parameters
  ctx.lineWidth = getScreenPixelsPerWorldUnit() * BORDERS_WIDTH;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  
  // draw the vertical gridlines
  for (let i = worldSpaceStartX; i < worldSpaceEndX; i++) {
    ctx.beginPath();
    ctx.moveTo(...worldSpaceToScreenSpace(i + 0.5, worldSpaceStartY));
    ctx.lineTo(...worldSpaceToScreenSpace(i + 0.5, worldSpaceEndY));
    ctx.stroke();
  }
  
  // draw the horizontal gridlines
  for (let i = worldSpaceStartY; i < worldSpaceEndY; i++) {
    ctx.beginPath();
    ctx.moveTo(...worldSpaceToScreenSpace(worldSpaceStartX, i + 0.5));
    ctx.lineTo(...worldSpaceToScreenSpace(worldSpaceEndX, i + 0.5));
    ctx.stroke();
  }
  
  // print useful text information
  ctx.fillStyle = 'white';
  ctx.font = '4vh Consolas';
  ctx.fillText(`X: ${posX.toFixed(3)}, Y: ${posY.toFixed(3)}, Scale: ${posScale.toFixed(Math.floor(-Math.log10(posScale) + 2))}`, canvas.width * 0.01, canvas.height * 0.89);
  ctx.fillText(`Time: ${conwaySim.currentT}`, canvas.width * 0.01, canvas.height * 0.93);
  ctx.fillText(`Simulation Running: ${simulationRunning}`, canvas.width * 0.01, canvas.height * 0.97);
}

// draws clock onto canvas
function renderFrame() {
  // get context
  let ctx = canvas.getContext('2d');
  
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // draw grid and cells
  drawConways(ctx);
}

// render frame loop, intended to only be run once (at page load)
async function renderFrameLoop() {
  if (renderFrameLoopStarted) return;
  
  renderFrameLoopStarted = true;
  
  renderFrame();
  
  await new Promise(r => setTimeout(r, CONWAYS_TURN_DELAY));
  
  while (true) {
    if (simulationRunning) {
      conwaySim.runOneTurn();
      
      renderFrame();
    }
    
    await new Promise(r => setTimeout(r, CONWAYS_TURN_DELAY));
  }
}
