let getConstants;
let getEndingCoords;
let getShiftedCoordsBasedOnSide;
let getWorldSpaceCorner;
let setConstants;
let ConwaySimulator;
let ConwayState;
let BoardTraverser;

switch (LIBRARY_MODE) {
  case 'js':
    (
      {
        getConstants,
        getEndingCoords,
        getShiftedCoordsBasedOnSide,
        getWorldSpaceCorner,
        setConstants,
        ConwaySimulator,
        ConwayState,
        BoardTraverser,
      } = _module__c284_conway_js__main
    );
    break;
}

setConstants(
  CONWAYS_GC_IDLE_TIME,
  CONWAYS_LOCK_IN_IDLE_TIME
);
