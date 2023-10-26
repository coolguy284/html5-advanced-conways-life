class ConwaySimulator {
  boardState = new ConwayState();
  turn = 0;
  currentT = 0;
  simulationArea;
  simulationObjects = [
    /*
    example content
    all objects are on gridlines, convention for x & y values then, is that they are -0.5, so bottom left corner of cell they are referring to
    {
      type: 'boundary',
      startingX: 0,
      startingY: 0,
      direction: 'right', // all 4 directions possible
      length: 10,
      facing: 'left', // can be left or right, is the side (left or right), if walking from start to end of boundary, where the boundary has an effect
      reversed: false, // makes the boundary's function get called in reverse order
      startingT: 0,
      endingT: 100,
      baseT: 0, // generally set to startingT, and it is the base time value for the boundary. useful if starting t is negative infinity
      behaviorFunc: (x, t) => {
        // t is zero at global startingT, x is zero at first position on the boundary, and goes up by 1 for each cell along boundary
        // function returns true if boundary should behave like live cell at that point, false for dead cell
        // can return positive number for "stronger" or "weaker" live value, as though many neighbors are live
        // function might get called with x values of -1 or equal to length (due to corner checking)
      }
    },
    {
      type: 'portal',
      startingX: 0,
      startingY: -10,
      direction: 'right',
      length: 10,
      facing: 'left',
      reversed: false,
      startingT: 0,
      endingT: 100,
      baseT: 0,
      links: [
        { id: 2, strength: 1, temporalShift: 0 },
        // strength means objects seen through the portal will have a positive number for strength value, as though many neighbors are live
        // temporalShift means objects seen through the portal will be at this shift relative to the present (!)
      ],
    },
    {
      type: 'portal',
      startingX: 10,
      startingY: -20,
      direction: 'left',
      length: 10,
      facing: 'left',
      reversed: false,
      startingT: 0,
      endingT: 100,
      baseT: 0,
      links: [
        { id: 1, strength: 1, temporalShift: 0 },
      ],
    }
    */
  ];
  
  // boardState passthrough methods
  
  getStateAt(x, y, t) {
    return this.boardState.getStateAt(x, y, t);
  }
  
  setStateAt(x, y, t, newState) {
    this.boardState.setStateAt(x, y, t, newState);
  }
  
  setDefaultState(defaultStateFunc) {
    this.boardState.setDefaultState(defaultStateFunc);
  }
  
  // simulation methods
  
  setSimulationArea(x1, y1, x2, y2) {
    this.simulationArea = { x1, y1, x2, y2 };
  }
  
  // https://en.wikipedia.org/wiki/Conway's_Game_of_Life
  // state is bool, liveNeighbors is typically integer but can be decimal
  getCellNextStateNumerical(currentState, liveNeighbors) {
    if (currentState == true) {
      if (liveNeighbors < 2) {
        return false;
      } else if (liveNeighbors <= 3) {
        return true;
      } else {
        return false;
      }
    } else {
      if (liveNeighbors == 3) {
        return true;
      } else {
        return false;
      }
    }
  }
  
  getCellLiveNeighborsSimple(x, y, t) {
    let liveNeighbors = 0;
    
    // use simple displacement offset for edges and diagonals
    
    liveNeighbors += this.boardState.getStateAt(x + 1, y, t);
    liveNeighbors += this.boardState.getStateAt(x - 1, y, t);
    liveNeighbors += this.boardState.getStateAt(x, y + 1, t);
    liveNeighbors += this.boardState.getStateAt(x, y - 1, t);
    
    liveNeighbors += this.boardState.getStateAt(x + 1, y + 1, t);
    liveNeighbors += this.boardState.getStateAt(x + 1, y - 1, t);
    liveNeighbors += this.boardState.getStateAt(x - 1, y + 1, t);
    liveNeighbors += this.boardState.getStateAt(x - 1, y - 1, t);
    
    return liveNeighbors;
  }
  
  getBoardTraverser(x, y, t) {
    return new BoardTraverser(this, x, y, t);
  }
  
  getCellLiveNeighborsAdvanced(x, y, t) {
    let liveNeighbors = 0;
    
    // initalize board traverser
    let traverser = this.getBoardTraverser(x, y, t);
    
    // 4 cartesian directions are straightforward
    liveNeighbors += traverser.moveLeft().getStateAt();
    liveNeighbors += traverser.moveRight().getStateAt();
    liveNeighbors += traverser.moveUp().getStateAt();
    liveNeighbors += traverser.moveDown().getStateAt();
    
    // diagonal values take an average of both paths (typically the same value for both unless an object is in the way)
    liveNeighbors += traverser.moveRight().moveUp().getStateAt() * 0.5;
    liveNeighbors += traverser.moveUp().moveRight().getStateAt() * 0.5;
    liveNeighbors += traverser.moveRight().moveDown().getStateAt() * 0.5;
    liveNeighbors += traverser.moveDown().moveRight().getStateAt() * 0.5;
    liveNeighbors += traverser.moveLeft().moveUp().getStateAt() * 0.5;
    liveNeighbors += traverser.moveUp().moveLeft().getStateAt() * 0.5;
    liveNeighbors += traverser.moveLeft().moveDown().getStateAt() * 0.5;
    liveNeighbors += traverser.moveDown().moveLeft().getStateAt() * 0.5;
    
    return liveNeighbors;
  }
  
  getCellLiveNeighbors(x, y, t) {
    if (this.simulationObjects.length > 0) {
      return this.getCellLiveNeighborsAdvanced(x, y, t);
    } else {
      return this.getCellLiveNeighborsSimple(x, y, t);
    }
  }
  
  runOneTurn() {
    let t = this.currentT;
    
    for (let y = this.simulationArea.y1; y <= this.simulationArea.y2; y++) {
      for (let x = this.simulationArea.x1; x <= this.simulationArea.x2; x++) {
        let liveNeighbors = this.getCellLiveNeighbors(x, y, t);
        
        let cellCurrentState = this.boardState.getStateAt(x, y, t);
        
        let cellNextState = this.getCellNextStateNumerical(cellCurrentState, liveNeighbors);
        
        this.boardState.setStateAt(x, y, t + 1, cellNextState);
      }
    }
    
    this.currentT++;
    this.turn++;
    
    this.boardState.incrementTurnIdles();
    this.boardState.gcIdleTimes();
    
    // lock times earlier than threshold (this has no effect for now becuase things cannot influence past)
    
    this.boardState.setLockedTimeIfGreater(t - CONWAYS_LOCK_IN_IDLE_TIME);
  }
  
  resetSimulation() {
    this.boardState.resetChanges();
    this.turn = 0;
    this.currentT = 0;
  }
  
  // adds a basic double sided boundary
  addBasicBoundary(
    startingX, startingY, direction, length,
    startingT, endingT,
    boundaryValue
  ) {
    if (boundaryValue == null) boundaryValue = false;
    
    this.simulationObjects.push({
      type: 'boundary',
      startingX,
      startingY,
      direction,
      length,
      facing: 'left',
      startingT,
      endingT,
      baseT: calculateBaseTFromStartAndEndT(startingT, endingT),
      behaviorFunc: (x, t) => boundaryValue,
    });
    
    this.simulationObjects.push({
      type: 'boundary',
      startingX,
      startingY,
      direction,
      length,
      facing: 'right',
      startingT,
      endingT,
      baseT: calculateBaseTFromStartAndEndT(startingT, endingT),
      behaviorFunc: (x, t) => boundaryValue,
    });
  }
  
  // adds a single sided boundary
  addSingleSidedBoundary(
    startingX, startingY, direction, length, facing,
    startingT, endingT,
    boundaryValue
  ) {
    if (boundaryValue == null) boundaryValue = false;
    
    this.simulationObjects.push({
      type: 'boundary',
      startingX,
      startingY,
      direction,
      length,
      facing,
      startingT,
      endingT,
      baseT: calculateBaseTFromStartAndEndT(startingT, endingT),
      behaviorFunc: (x, t) => boundaryValue,
    });
  }
  
  // adds a portal pair, with boundaries on the back
  addPortalPairWithBackBoundaries(
    firstStartingX, firstStartingY, firstDirection, firstFacing, firstReversed,
    secondStartingX, secondStartingY, secondDirection, secondFacing, secondReversed,
    length,
    firstStartingT, firstEndingT,
    temporalShift // shift is how far the second portal is "in the future" compared to the first
  ) {
    this.simulationObjects.push({
      type: 'portal',
      startingX: firstStartingX,
      startingY: firstStartingY,
      direction: firstDirection,
      length,
      facing: firstFacing,
      reversed: firstReversed,
      startingT: firstStartingT,
      endingT: firstEndingT,
      baseT: calculateBaseTFromStartAndEndT(firstStartingT, firstEndingT),
      links: [
        {
          id: this.simulationObjects.length + 2,
          strength: 1,
          temporalShift: temporalShift,
        },
      ],
    });
    
    this.simulationObjects.push({
      type: 'boundary',
      startingX: firstStartingX,
      startingY: firstStartingY,
      direction: firstDirection,
      length,
      facing: firstFacing == 'left' ? 'right' : 'left',
      startingT: firstStartingT,
      endingT: firstEndingT,
      baseT: calculateBaseTFromStartAndEndT(firstStartingT, firstEndingT),
      behaviorFunc: (x, t) => false,
    });
    
    let secondStartingT = firstStartingT + temporalShift;
    let secondEndingT = firstEndingT + temporalShift;
    
    this.simulationObjects.push({
      type: 'portal',
      startingX: secondStartingX,
      startingY: secondStartingY,
      direction: secondDirection,
      length,
      facing: secondFacing,
      reversed: secondReversed,
      startingT: secondStartingT,
      endingT: secondEndingT,
      baseT: calculateBaseTFromStartAndEndT(secondStartingT, secondEndingT),
      links: [
        {
          id: this.simulationObjects.length - 2,
          strength: 1,
          temporalShift: -temporalShift,
        },
      ],
    });
    
    this.simulationObjects.push({
      type: 'boundary',
      startingX: secondStartingX,
      startingY: secondStartingY,
      direction: secondDirection,
      length,
      facing: secondFacing == 'left' ? 'right' : 'left',
      startingT: secondStartingT,
      endingT: secondEndingT,
      baseT: calculateBaseTFromStartAndEndT(secondStartingT, secondEndingT),
      behaviorFunc: (x, t) => false,
    });
  }
}
