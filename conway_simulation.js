// class for the state of the conway board
// default state func accepts (x, y, t) and returns true or false for state
// this object only stores changes to the default state
class ConwayState {
  defaultStateFunc;
  board;
  
  constructor() {
    this.board = new Set();
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
    
    let stateString = `${x},${y},${t}`;
    let defaultState = this.defaultStateFunc(x, y, t);
    
    if (this.board.has(stateString)) {
      return !defaultState;
    } else {
      return defaultState;
    }
  }
  
  setStateAt(x, y, t, newState) {
    this.errorIfNoDefaultState();
    
    let stateString = `${x},${y},${t}`;
    let defaultState = this.defaultStateFunc(x, y, t);
    
    if (newState == defaultState) {
      this.board.delete(stateString);
    } else {
      this.board.add(stateString);
    }
  }
  
  toggleStateAt(x, y, t) {
    this.errorIfNoDefaultState();
    
    let stateString = `${x},${y},${t}`;
    
    if (this.board.has(stateString)) {
      this.board.delete(stateString);
    } else {
      this.board.add(stateString);
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
  }
}
