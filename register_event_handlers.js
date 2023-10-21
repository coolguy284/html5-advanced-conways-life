// register event listeners
addEventListener('load', () => {
  resetCanvasSize();
  
  // start the rendering frame loop
  //renderFrameLoop();
  renderFrame();
});

addEventListener('resize', () => {
  resetCanvasSize();
  renderFrame();
});
