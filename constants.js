// constants to change program operation
let BORDERS_WIDTH = 0.05; // fraction of cell size
let SCROLL_INCREMENT_FACTOR = 1000; // bigger numbers scroll slower
let MIN_POS_SCALE = 0.005;
let MAX_POS_SCALE = 5;
let CONWAYS_TURN_DELAY = 10; // in milliseconds
let CONWAYS_LOCKIN_IDLE_TIME = 100; // number of turns that a time instant goes untouched before its considered "locked"
let CONWAYS_GC_IDLE_TIME = 200; // number of turns that a time instant goes untouched before its state is simply removed
