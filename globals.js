// global variables
let renderFrameLoopStarted = false;
let posX = 0;
let posY = 0;
let posScale = 0.1;
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

let makeArrayReadingFunc = (array) => {
  return (x, y, t) => {
    if (t == 0 && x >= 0 && x < array[0].length && y >= 0 && y < array.length) {
      return Boolean(array[y][x]);
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
    conwaySim.setDefaultState(makeArrayReadingFunc(smallStableThing));
    break;
  
  case 3:
    conwaySim.setDefaultState(makeArrayReadingFunc(glider));
    break;
  
  case 4:
    conwaySim.setDefaultState(makeArrayReadingFunc(gosperGliderGun));
    break;
}
