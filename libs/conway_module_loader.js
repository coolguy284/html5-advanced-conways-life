let getEndingCoords;
let getShiftedCoordsBasedOnSide;
let getWorldSpaceCorner;
let ConwaySimulator;
let ConwayState;
let BoardTraverser;

switch (LIBRARY_MODE) {
  case 'js':
    (
      {
        getEndingCoords,
        getShiftedCoordsBasedOnSide,
        getWorldSpaceCorner,
        ConwaySimulator,
        ConwayState,
        BoardTraverser,
      } = _module__c284_conway_js__main
    );
    break;
}
