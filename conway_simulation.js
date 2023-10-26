// gets the corner coordinate of the given cell
function getWorldSpaceCorner(x, y, corner) {
  switch (corner) {
    case 'bottom left': return [x - 0.5, y - 0.5];
    case 'top left': return [x - 0.5, y + 0.5];
    case 'bottom right': return [x + 0.5, y - 0.5];
    case 'top right': return [x + 0.5, y + 0.5];
    default: throw new Error(`Invalid corner ${corner}`);
  }
}

// simple calculation of baseT from start and end T values
function calculateBaseTFromStartAndEndT(startT, endT) {
  return Number.isFinite(startT) ? startT : Number.isFinite(endT) ? endT : 0;
}

// class for the state of the conway board
// default state func accepts (x, y, t) and returns true or false for state
// this object only stores changes to the default state
class ConwayState {
  defaultStateFunc;
  // board is object containing times as keys, and a set of altered points as values
  board;
  lockedT = -Infinity; // times equal to or below this cannot be edited
  
  constructor() {
    this.board = {};
  }
  
  setDefaultState(defaultStateFunc) {
    this.defaultStateFunc = defaultStateFunc;
  }
  
  errorIfNoDefaultState() {
    if (!this.defaultStateFunc) {
      throw new Error('Error: no default state func specified');
    }
  }
  
  getStateAt(x, y, t) {
    this.errorIfNoDefaultState();
    
    let stateString = `${x},${y}`;
    let defaultState = this.defaultStateFunc(x, y, t);
    
    if (t in this.board) {
      if (this.board[t].set.has(stateString)) {
        return !defaultState;
      } else {
        return defaultState;
      }
    } else {
      return defaultState;
    }
  }
  
  setStateAt(x, y, t, newState) {
    this.errorIfNoDefaultState();
    
    // break early (do nothing) if time is locked
    if (this.lockedT >= t) return;
    
    let stateString = `${x},${y}`;
    let defaultState = this.defaultStateFunc(x, y, t);
    
    if (newState == defaultState) {
      if (t in this.board) {
        this.board[t].set.delete(stateString);
        this.board[t].turnsIdle = 0;
        
        if (this.board[t].set.size == 0) {
          delete this.board[t];
        }
      }
    } else {
      if (!(t in this.board)) {
        this.board[t] = { set: new Set(), turnsIdle: 0 };
      } else {
        this.board[t].turnsIdle = 0;
      }
      
      this.board[t].set.add(stateString);
    }
  }
  
  toggleStateAt(x, y, t) {
    this.errorIfNoDefaultState();
    
    this.setStateAt(x, y, t, !this.getStateAt(x, y, t));
  }
  
  incrementTurnIdles() {
    for (let t in this.board) {
      this.board[t].turnsIdle++;
    }
  }
  
  gcIdleTimes() {
    for (let t in this.board) {
      if (this.board[t].turnsIdle > CONWAYS_GC_IDLE_TIME) {
        delete this.board[t];
      }
    }
  }
  
  getLockedTime() {
    return this.lockedT;
  }
  
  setLockedTime(t) {
    this.lockedT = t;
  }
  
  setLockedTimeIfGreater(t) {
    if (t > this.lockedT) {
      this.setLockedTime(t);
    }
  }
  
  resetChanges() {
    this.board = {};
    this.lockedT = -Infinity;
  }
}

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
    startingT, endingT
  ) {
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
      behaviorFunc: (x, t) => false,
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
      behaviorFunc: (x, t) => false,
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

function getEndingCoords(startingX, startingY, direction, length) {
  switch (direction) {
    case 'up': return [startingX, startingY + length];
    case 'down': return [startingX, startingY - length];
    case 'left': return [startingX - length, startingY];
    case 'right': return [startingX + length, startingY];
    default: throw new Error(`Invalid direction ${direction}`);
  }
}

// gets visually shifted coords of an object to show its facing direction
function getShiftedCoordsBasedOnSide(x, y, direction, facing, coordShiftAmt) {
  let scaledCoordShiftAmt;
  
  switch (facing) {
    case 'left':
      scaledCoordShiftAmt = coordShiftAmt;
      break;
    
    case 'right':
      scaledCoordShiftAmt = -coordShiftAmt;
      break;
    
    default:
      throw new Error(`Invalid facing ${facing}`);
  }
  
  switch (direction) {
    case 'up': return [x - scaledCoordShiftAmt, y];
    case 'down': return [x + scaledCoordShiftAmt, y];
    case 'left': return [x, y - scaledCoordShiftAmt];
    case 'right': return [x, y + scaledCoordShiftAmt];
    default: throw new Error(`Invalid direction ${direction}`);
  }
}

// simple object to move around on the board of a conwaysim object
// this object is designed to be immutable, movement methods return a new traverser object
class BoardTraverser {
  conwaySim;
  x;
  y;
  t;
  
  selfX_trueXScale = 1;
  selfX_trueYScale = 0;
  selfY_trueXScale = 0;
  selfY_trueYScale = 1;
  
  constructor(
    conwaySim,
    x, y, t,
    selfX_trueXScale, selfX_trueYScale,
    selfY_trueXScale, selfY_trueYScale) {
    this.conwaySim = conwaySim;
    this.x = x;
    this.y = y;
    this.t = t;
    
    if (selfX_trueXScale != null) {
      this.selfX_trueXScale = selfX_trueXScale;
      this.selfX_trueYScale = selfX_trueYScale;
      this.selfY_trueXScale = selfY_trueXScale;
      this.selfY_trueYScale = selfY_trueYScale;
    }
  }
  
  getPosition() {
    return { x: this.x, y: this.y, t: this.t };
  }
  
  getStateAt() {
    return this.conwaySim.getStateAt(this.x, this.y, this.t);
  }
  
  // returns an object with intersection info if true, or null if not
  checkIfMovementDeltaIntersectsAnObject(x, y) {
    let movementIsHorizontal = x != 0;
    
    // for every simulation object
    for (let simObject of this.conwaySim.simulationObjects) {
      switch (simObject.type) {
        case 'boundary':
        case 'portal':
          // if its of the right type
          
          let [ shiftedStartingX, shiftedStartingY ] = getWorldSpaceCorner(simObject.startingX, simObject.startingY, 'bottom left');
          let [ shiftedEndingX, shiftedEndingY ] = getWorldSpaceCorner(
            ...getEndingCoords(simObject.startingX, simObject.startingY, simObject.direction, simObject.length),
            'bottom left'
          );
          
          // swap shifted values if they are in reverse order
          if (shiftedEndingX < shiftedStartingX) {
            [ shiftedStartingX, shiftedEndingX ] = [shiftedEndingX, shiftedStartingX];
          }
          if (shiftedEndingY < shiftedStartingY) {
            [ shiftedStartingY, shiftedEndingY ] = [shiftedEndingY, shiftedStartingY];
          }
          
          // if movement is horizontal
          if (movementIsHorizontal) {
            // and simulation object is perpendicular (vertical)
            if (simObject.direction == 'up' || simObject.direction == 'down') {
              // and simulation object is one step in front of object
              if (x > 0 && this.x + 0.5 == shiftedStartingX || x < 0 && this.x - 0.5 == shiftedStartingX) {
                // and current y is within simulation object's bounds
                if (this.y > shiftedStartingY && this.y < shiftedEndingY) {
                  // and simulation object direction, simulation object facing, and direction of traversal line up
                  if (COLLISION_MATRIX_HORIZONTAL[(simObject.direction == 'up') * 4 + (simObject.facing == 'right') * 2 + (x > 0)]) {
                    // then there was a collision
                    let positionAlongObject = simObject.startingY - this.y - 1;
                    
                    if (simObject.reversed) {
                      positionAlongObject = simObject.length - positionAlongObject - 1;
                    }
                    
                    let timeRelToObject = this.t - simObject.baseT;
                    
                    return {
                      object: simObject,
                      positionAlongObject,
                      timeRelToObject,
                    };
                  }
                }
              }
            }
          } else {
            // or if movement is vertical
            
            // and simulation object is perpendicular (horizontal)
            if (simObject.direction == 'left' || simObject.direction == 'right') {
              // and simulation object is one step in front of object
              if (y > 0 && this.y + 0.5 == shiftedStartingY || y < 0 && this.y - 0.5 == shiftedStartingY) {
                // and current x is within simulation object's bounds
                if (this.x > shiftedStartingX && this.x < shiftedEndingX) {
                  // and simulation object direction, simulation object facing, and direction of traversal line up
                  if (COLLISION_MATRIX_VERTICAL[(simObject.direction == 'right') * 4 + (simObject.facing == 'right') * 2 + (y > 0)]) {
                    // then there was a collision
                    let positionAlongObject = simObject.startingX - this.x - 1;
                    
                    if (simObject.reversed) {
                      positionAlongObject = simObject.length - positionAlongObject - 1;
                    }
                    
                    let timeRelToObject = this.t - simObject.baseT;
                    
                    return {
                      object: simObject,
                      positionAlongObject,
                      timeRelToObject,
                    };
                  }
                }
              }
            }
          }
      }
    }
          
    // otherwise there was no collision
    return null;
  }
  
  // these functions are only intended to move in a single cartesian direction by 1
  
  // underlying movement and transformation functions
  
  trueMoveBy(x, y) {
    return new BoardTraverser(
      this.conwaySim,
      this.x + x, this.y + y, this.t,
      this.selfX_trueXScale, this.selfX_trueYScale,
      this.selfY_trueXScale, this.selfY_trueYScale
    );
  }
  
  rotate(multipleOf90CCW) {
    switch (multipleOf90CCW) {
      case 0:
        return this;
      
      case 1:
        return new BoardTraverser(
          this.conwaySim,
          this.x, this.y, this.t,
          -this.selfX_trueYScale, this.selfX_trueXScale,
          -this.selfY_trueYScale, this.selfY_trueXScale
        );
      
      case 2:
        return new BoardTraverser(
          this.conwaySim,
          this.x, this.y, this.t,
          -this.selfX_trueXScale, -this.selfX_trueYScale,
          -this.selfY_trueXScale, -this.selfY_trueYScale
        );
      
      case 3:
        return new BoardTraverser(
          this.conwaySim,
          this.x, this.y, this.t,
          this.selfX_trueYScale, -this.selfX_trueXScale,
          this.selfY_trueYScale, -this.selfY_trueXScale
        );
    }
  }
  
  flipX() {
    return new BoardTraverser(
      this.conwaySim,
      this.x, this.y, this.t,
      -this.selfX_trueXScale, this.selfX_trueYScale,
      -this.selfY_trueXScale, this.selfY_trueYScale
    );
  }
  
  flipY() {
    return new BoardTraverser(
      this.conwaySim,
      this.x, this.y, this.t,
      this.selfX_trueXScale, -this.selfX_trueYScale,
      this.selfY_trueXScale, -this.selfY_trueYScale
    );
  }
  
  // helper functions
  
  getTrueMovementDelta(x, y) {
    return [
      this.selfX_trueXScale * x + this.selfY_trueXScale * y,
      this.selfX_trueYScale * x + this.selfY_trueYScale * y,
    ];
  }
  
  // relative movement functions
  
  moveBy(x, y) {
    // for now simply step in the given direction applying rotation and scale
    
    return this.trueMoveBy(...this.getTrueMovementDelta(x, y));
  }
  
  moveLeft() { return this.moveBy(-1, 0); }
  moveRight() { return this.moveBy(1, 0); }
  moveUp() { return this.moveBy(0, 1); }
  moveDown() { return this.moveBy(0, -1); }
}
