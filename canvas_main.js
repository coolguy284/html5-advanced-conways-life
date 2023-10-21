function getScreenPixelsPerWorldUnit() {
  return canvas.height * posScale;
}

function worldSpaceToScreenSpace(x, y) {
  let screenPixelsPerWorldUnit = getScreenPixelsPerWorldUnit();
  
  return [
    canvas.width / 2 + x * screenPixelsPerWorldUnit,
    canvas.height / 2 + y * screenPixelsPerWorldUnit,
  ];
}

// draws the conway's game of life grid onto the string
function drawConways(ctx) {
  // grid vars
  let squareSize = getScreenPixelsPerWorldUnit();
  let numLinesX = Math.floor((canvas.width / 2) / squareSize);
  let numLinesY = Math.floor((canvas.height / 2) / squareSize);
  let numSquaresX = numLinesX + 1;
  let numSquaresY = numLinesY + 1;
  
  // draw whether each cell is filled in or not
  for (let j = -numSquaresY; j <= numSquaresY; j++) {
    for (let i = -numSquaresX; i <= numSquaresX; i++) {
      if (false) {
        ctx.fillStyle = 'white';
        ctx.fillRect(
          ...worldSpaceToScreenSpace(i - 0.5, j - 0.5),
          squareSize, squareSize
        );
      }
    }
  }
  
  // set line drawing parameters
  ctx.lineWidth = getScreenPixelsPerWorldUnit() * BORDERS_WIDTH;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  
  // draw the vertical gridlines
  for (let i = -numLinesX; i <= numLinesX + 1; i++) {
    ctx.beginPath();
    ctx.moveTo(...worldSpaceToScreenSpace(i - 0.5, -numLinesY - 1));
    ctx.lineTo(...worldSpaceToScreenSpace(i - 0.5, numLinesY + 1));
    ctx.stroke();
  }
  
  // draw the horizontal gridlines
  for (let i = -numLinesY; i <= numLinesY + 1; i++) {
    ctx.beginPath();
    ctx.moveTo(...worldSpaceToScreenSpace(-numLinesX - 1, i - 0.5));
    ctx.lineTo(...worldSpaceToScreenSpace(numLinesX + 1, i - 0.5));
    ctx.stroke();
  }
}

// draws clock onto canvas
function renderFrame() {
  // get current date
  let now = new Date();
  
  // get context
  let ctx = canvas.getContext('2d');
  
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawConways(ctx);
}

// render frame loop, intended to only be run once (at page load)
async function renderFrameLoop() {
  if (renderFrameLoopStarted) return;
  
  renderFrameLoopStarted = true;
  
  while (true) {
    renderFrame();
    
    for (let i = 0; i < 100; i++) {
      await new Promise(r => requestAnimationFrame(r));
    }
  }
}
