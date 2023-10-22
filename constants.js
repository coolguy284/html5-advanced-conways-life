// constants to change program operation
let INITIAL_POS_X = 0;
let INITIAL_POS_Y = 0;
let INITIAL_POS_SCALE = 0.02;
let BORDERS_WIDTH = 0.05; // fraction of cell size
let SIMULATION_BOUNDARY_WIDTH = 0.1; // fraction of cell size
let OBJECTS_WIDTH = 0.05; // fraction of cell size
let SCROLL_INCREMENT_FACTOR = 1000; // bigger numbers scroll slower
let MIN_POS_SCALE = 0.005;
let MAX_POS_SCALE = 5;
let CONWAYS_TURN_DELAY = 10; // in milliseconds
let CONWAYS_LOCK_IN_IDLE_TIME = 100; // number of turns that a time instant goes untouched before its considered "locked"
let CONWAYS_GC_IDLE_TIME = 10000; // number of turns that a time instant goes untouched before its state is simply removed
