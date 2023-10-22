// global variables
let renderFrameLoopStarted = false;
let posX = INITIAL_POS_X;
let posY = INITIAL_POS_Y;
let posScale = INITIAL_POS_SCALE;
let simulationRunning = false;

let conwaySim = new ConwaySimulator();

conwaySim.setSimulationArea(-50, -50, 50, 50);

let simMode = 4;

// https://en.wikipedia.org/wiki/Conway's_Game_of_Life
let smallStableThing = [
  [1, 1],
  [1, 1],
];

let glider = [
  [0, 0, 1],
  [1, 0, 1],
  [0, 1, 1],
];

let gosperGliderGun = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

// y coordinate is flipped as higher array indices should appear lower visually
let makeArrayReadingFunc = (array, startingX, startingY) => {
  return (x, y, t) => {
    x -= startingX;
    y -= startingY;
    if (t == 0 && x >= 0 && x < array[0].length && y >= 0 && y < array.length) {
      return Boolean(array[array.length - y - 1][x]);
    } else {
      return false;
    }
  }
};

switch (simMode) {
  case 1:
    conwaySim.setDefaultState((x, y, t) => {
      if (t == 0 && x == 0 && y == 0) {
        return true;
      } else {
        return false;
      }
    });
    break;
  
  case 2:
    conwaySim.setDefaultState(makeArrayReadingFunc(smallStableThing, 0, 0));
    break;
  
  case 3:
    conwaySim.setDefaultState(makeArrayReadingFunc(glider, -1, -1));
    break;
  
  case 4:
    conwaySim.setDefaultState(makeArrayReadingFunc(gosperGliderGun, -17, -2));
    break;
}
