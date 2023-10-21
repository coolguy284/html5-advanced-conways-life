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
}
