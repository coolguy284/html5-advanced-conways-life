// global variables
let renderFrameLoopStarted = false;
let posX = 0;
let posY = 0;
let posScale = 0.1;

let conwaySim = new ConwaySimulator();
conwaySim.setDefaultState((x, y, t) => {
  if (x == 0 && y == 0) return true;
  return false;
});
conwaySim.setSimulationArea(-10, -10, 10, 10);
