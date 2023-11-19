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

function drawSlabObject(ctx, startingX, startingY, direction, length, facing) {
  ctx.beginPath();
  ctx.moveTo(
    ...worldSpaceToScreenSpace(
      ...getShiftedCoordsBasedOnSide(
        ...getWorldSpaceCorner(startingX, startingY, 'bottom left'),
        direction,
        facing,
        OBJECTS_WIDTH / 2
      )
    )
  );
  ctx.lineTo(
    ...worldSpaceToScreenSpace(
      ...getShiftedCoordsBasedOnSide(
        ...getWorldSpaceCorner(
          ...getEndingCoords(startingX, startingY, direction, length),
          'bottom left'
        ),
        direction,
        facing,
        OBJECTS_WIDTH / 2
      )
    )
  );
  ctx.stroke();
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
  
  // other vars
  let timeValueShown = timeSynced ? conwaySim.currentT : detatchedTimeValue;
  
  // draw whether each cell is filled in or not
  for (let j = worldSpaceStartY; j <= worldSpaceEndY; j++) {
    for (let i = worldSpaceStartX; i <= worldSpaceEndX; i++) {
      if (conwaySim.boardState.getStateAt(i, j, timeValueShown)) {
        ctx.fillStyle = 'white';
        ctx.fillRect(
          ...worldSpaceToScreenSpace(...getWorldSpaceCorner(i, j, 'top left')),
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
  
  // draw simulation boundary
  ctx.strokeStyle = SIMULATION_BOUNDARY_COLOR;
  ctx.lineWidth = getScreenPixelsPerWorldUnit() * SIMULATION_BOUNDARY_WIDTH;
  
  ctx.beginPath();
  ctx.moveTo(...worldSpaceToScreenSpace(...getWorldSpaceCorner(conwaySim.simulationArea.x1, conwaySim.simulationArea.y1, 'bottom left')));
  ctx.lineTo(...worldSpaceToScreenSpace(...getWorldSpaceCorner(conwaySim.simulationArea.x1, conwaySim.simulationArea.y2, 'top left')));
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(...worldSpaceToScreenSpace(...getWorldSpaceCorner(conwaySim.simulationArea.x2, conwaySim.simulationArea.y1, 'bottom right')));
  ctx.lineTo(...worldSpaceToScreenSpace(...getWorldSpaceCorner(conwaySim.simulationArea.x2, conwaySim.simulationArea.y2, 'top right')));
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(...worldSpaceToScreenSpace(...getWorldSpaceCorner(conwaySim.simulationArea.x1, conwaySim.simulationArea.y1, 'bottom left')));
  ctx.lineTo(...worldSpaceToScreenSpace(...getWorldSpaceCorner(conwaySim.simulationArea.x2, conwaySim.simulationArea.y1, 'bottom right')));
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(...worldSpaceToScreenSpace(...getWorldSpaceCorner(conwaySim.simulationArea.x1, conwaySim.simulationArea.y2, 'top left')));
  ctx.lineTo(...worldSpaceToScreenSpace(...getWorldSpaceCorner(conwaySim.simulationArea.x2, conwaySim.simulationArea.y2, 'top right')));
  ctx.stroke();
  
  // draw simulation objects
  for (let simObject of conwaySim.simulationObjects) {
    // only render if object exists at that time
    if (timeValueShown >= simObject.startingT && timeValueShown <= simObject.endingT) {
      switch (simObject.type) {
        case 'boundary':
          ctx.strokeStyle = BOUNDARY_COLOR;
          ctx.lineWidth = getScreenPixelsPerWorldUnit() * OBJECTS_WIDTH;
          
          drawSlabObject(ctx, simObject.startingX, simObject.startingY, simObject.direction, simObject.length, simObject.facing);
          break;
        
        case 'portal':
          ctx.strokeStyle = PORTAL_COLOR;
          ctx.lineWidth = getScreenPixelsPerWorldUnit() * OBJECTS_WIDTH;
          
          drawSlabObject(ctx, simObject.startingX, simObject.startingY, simObject.direction, simObject.length, simObject.facing);
          break;
      }
    }
  }
  
  // if debug traversing, draw debug traverser object with debug text
  if (debugTraversing) {
    ctx.fillStyle = 'orange';
    ctx.fillRect(
      ...worldSpaceToScreenSpace(debugTraverser.x - 0.25, debugTraverser.y + 0.25),
      squareSize / 2, squareSize / 2
    );
    
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(...worldSpaceToScreenSpace(debugTraverser.x, debugTraverser.y));
    ctx.lineTo(...worldSpaceToScreenSpace(debugTraverser.x + debugTraverser.selfX_trueXScale, debugTraverser.y + debugTraverser.selfX_trueYScale));
    ctx.stroke();
    
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(...worldSpaceToScreenSpace(debugTraverser.x, debugTraverser.y));
    ctx.lineTo(...worldSpaceToScreenSpace(debugTraverser.x + debugTraverser.selfY_trueXScale, debugTraverser.y + debugTraverser.selfY_trueYScale));
    ctx.stroke();
    
    let textHeight = 0.5;
    let textX = 1.3;
    ctx.fillStyle = 'cyan';
    ctx.font = `${textHeight}px Consolas`;
    ctx.save();
    ctx.translate(...worldSpaceToScreenSpace(debugTraverser.x, debugTraverser.y));
    ctx.scale(squareSize, squareSize);
    ctx.fillText(`X: ${debugTraverser.x}, Y: ${debugTraverser.y}`, textX, 0);
    ctx.fillText(`T: ${debugTraverser.t}`, textX, textHeight);
    ctx.fillText(`X_X: ${debugTraverser.selfX_trueXScale}, X_Y: ${debugTraverser.selfX_trueYScale}`, textX, textHeight * 2);
    ctx.fillText(`Y_X: ${debugTraverser.selfY_trueXScale}, Y_Y: ${debugTraverser.selfY_trueYScale}`, textX, textHeight * 3);
    ctx.fillText(`InBound: ${debugTraverser.insideBoundary}`, textX, textHeight * 4);
    ctx.fillText(`Bound_ID: ${conwaySim.simulationObjects.indexOf(debugTraverser.boundaryObject)}`, textX, textHeight * 5);
    ctx.fillText(`Bound_Leave: ${debugTraverser.boundaryDisengageDirection}`, textX, textHeight * 6);
    ctx.fillText(`Bound_Along: ${debugTraverser.boundaryMovementDirection}`, textX, textHeight * 7);
    ctx.fillText(`Bound_X: ${debugTraverser.boundaryRelPos}`, textX, textHeight * 8);
    ctx.fillText(`Bound_T: ${debugTraverser.boundaryRelTime}`, textX, textHeight * 9);
    ctx.restore();
  }
  
  // print useful text information
  ctx.fillStyle = 'white';
  ctx.font = '4vh Consolas';
  ctx.fillText(`X: ${posX.toFixed(3)}, Y: ${posY.toFixed(3)}, Scale: ${posScale.toFixed(Math.floor(-Math.log10(posScale) + 2))}`, canvas.width * 0.01, canvas.height * 0.85);
  ctx.fillText(`Time: ${(timeValueShown + '').padEnd(6)}  Synced: ${timeSynced}`, canvas.width * 0.01, canvas.height * 0.89);
  ctx.fillText(`Simulation Running: ${simulationRunning}`, canvas.width * 0.01, canvas.height * 0.93);
  ctx.fillText(`Simulation Time: ${conwaySim.currentT}`, canvas.width * 0.01, canvas.height * 0.97);
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
    if (previousTimeAfterRender == null) {
      previousTimeAfterRender = Date.now();
    }
    
    if (simulationRunning) {
      conwaySim.runOneTurn();
      
      renderFrame();
    }
    
    let timeAfterRender = Date.now();
    
    let timeToRender = timeAfterRender - previousTimeAfterRender;
    
    if (timeToRender > 0) {
      await new Promise(r => setTimeout(r, CONWAYS_TURN_DELAY - timeToRender));
    }
    
    previousTimeAfterRender = timeAfterRender;
  }
}
