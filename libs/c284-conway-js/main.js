let _module__c284_conway_js__main = (() => {
  let {
    getConstants,
    setConstants
  } = _module__c284_conway_js__constants;
  let {
    getEndingCoords,
    getShiftedCoordsBasedOnSide,
    getWorldSpaceCorner,
  } = _module__c284_conway_js__helper_funcs;
  let { ConwaySimulator } = _module__c284_conway_js__simulator_class;
  let { ConwayState } = _module__c284_conway_js__state_class;
  let { BoardTraverser } = _module__c284_conway_js__traverser_class;
  
  return {
    getConstants,
    getEndingCoords,
    getShiftedCoordsBasedOnSide,
    getWorldSpaceCorner,
    setConstants,
    ConwaySimulator,
    ConwayState,
    BoardTraverser,
  };
})();
