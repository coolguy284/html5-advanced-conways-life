// ui initial state constants
let INITIAL_POS_X = 0;
let INITIAL_POS_Y = 0;
let INITIAL_POS_SCALE = 0.02;

// ui behavior constants
let SCROLL_INCREMENT_FACTOR = 1000; // bigger numbers scroll slower
let MIN_POS_SCALE = 0.005;
let MAX_POS_SCALE = 5;

// rendering constants
let BORDERS_WIDTH = 0.05; // fraction of cell size
let SIMULATION_BOUNDARY_WIDTH = 0.1; // fraction of cell size
let SIMULATION_BOUNDARY_COLOR = 'red';
let OBJECTS_WIDTH = 0.05; // fraction of cell size
let BOUNDARY_COLOR = 'lime';
let PORTAL_COLOR = 'cyan';
let CONWAYS_TURN_DELAY = 10; // in milliseconds

// simulation constants
let CONWAYS_LOCK_IN_IDLE_TIME = 100; // number of turns that a time instant goes untouched before its considered "locked"
let CONWAYS_GC_IDLE_TIME = 10000; // number of turns that a time instant goes untouched before its state is simply removed
let LIBRARY_MODE = 'js'; // options 'js' or in future 'rust-webassembly'
