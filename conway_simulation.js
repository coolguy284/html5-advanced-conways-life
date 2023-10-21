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
}

class ConwaySimulator {
  boardState = new ConwayState();
  turn = 0;
  currentT = 0;
  simulationArea;
  
  setDefaultState(defaultStateFunc) {
    this.boardState.setDefaultState(defaultStateFunc);
  }
  
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
  
  getCellLiveNeighbors(x, y, t) {
    let liveNeighbors = 0;
    
    // 4 cartesian directions are easy
    
    liveNeighbors += this.boardState.getStateAt(x + 1, y, t);
    liveNeighbors += this.boardState.getStateAt(x - 1, y, t);
    liveNeighbors += this.boardState.getStateAt(x, y + 1, t);
    liveNeighbors += this.boardState.getStateAt(x, y - 1, t);
    
    // for now the diagonals are easy too, but will eventually make this a more complicated process
    
    liveNeighbors += this.boardState.getStateAt(x + 1, y + 1, t);
    liveNeighbors += this.boardState.getStateAt(x + 1, y - 1, t);
    liveNeighbors += this.boardState.getStateAt(x - 1, y + 1, t);
    liveNeighbors += this.boardState.getStateAt(x - 1, y - 1, t);
    
    return liveNeighbors;
  }
  
  runOneTurn() {
    let t = this.currentT;
    
    for (let y = this.simulationArea.y1; y < this.simulationArea.y2; y++) {
      for (let x = this.simulationArea.x1; x < this.simulationArea.x2; x++) {
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
}
