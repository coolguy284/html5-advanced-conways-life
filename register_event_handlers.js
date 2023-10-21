// register event listeners
addEventListener('load', () => {
  resetCanvasSize();
  
  // start the rendering frame loop
  renderFrameLoop();
});

addEventListener('resize', () => {
  resetCanvasSize();
  renderFrame();
});
