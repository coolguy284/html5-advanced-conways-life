let _module__c284_conway_js__state_class = (() => {
  let { CONSTANTS } = _module__c284_conway_js__constants;
  
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
        if (this.board[t].turnsIdle > CONSTANTS.CONWAYS_GC_IDLE_TIME) {
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
  
  return {
    ConwayState,
  };
})();
