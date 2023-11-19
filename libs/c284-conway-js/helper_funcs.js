let _module__c284_conway_js__helper_funcs = (() => {
  // gets the corner coordinate of the given cell
  function getWorldSpaceCorner(x, y, corner) {
    switch (corner) {
      case 'bottom left': return [x - 0.5, y - 0.5];
      case 'top left': return [x - 0.5, y + 0.5];
      case 'bottom right': return [x + 0.5, y - 0.5];
      case 'top right': return [x + 0.5, y + 0.5];
      default: throw new Error(`Invalid corner ${corner}`);
    }
  }
  
  // simple calculation of baseT from start and end T values
  function calculateBaseTFromStartAndEndT(startT, endT) {
    return Number.isFinite(startT) ? startT : Number.isFinite(endT) ? endT : 0;
  }
  
  function getEndingCoords(startingX, startingY, direction, length) {
    switch (direction) {
      case 'up': return [startingX, startingY + length];
      case 'down': return [startingX, startingY - length];
      case 'left': return [startingX - length, startingY];
      case 'right': return [startingX + length, startingY];
      default: throw new Error(`Invalid direction ${direction}`);
    }
  }
  
  // gets visually shifted coords of an object to show its facing direction
  function getShiftedCoordsBasedOnSide(x, y, direction, facing, coordShiftAmt) {
    let scaledCoordShiftAmt;
    
    switch (facing) {
      case 'left':
        scaledCoordShiftAmt = coordShiftAmt;
        break;
      
      case 'right':
        scaledCoordShiftAmt = -coordShiftAmt;
        break;
      
      default:
        throw new Error(`Invalid facing ${facing}`);
    }
    
    switch (direction) {
      case 'up': return [x - scaledCoordShiftAmt, y];
      case 'down': return [x + scaledCoordShiftAmt, y];
      case 'left': return [x, y - scaledCoordShiftAmt];
      case 'right': return [x, y + scaledCoordShiftAmt];
      default: throw new Error(`Invalid direction ${direction}`);
    }
  }
  
  function convertWordDirectionToCoordPair(directionWord) {
    switch (directionWord) {
      case 'up': return [0, 1];
      case 'down': return [0, -1];
      case 'left': return [-1, 0];
      case 'right': return [1, 0];
      default: throw new Error(`Invalid direction ${direction}`);
    }
  }
  
  function convertDirectionCoordPairToWord(directionCoordPair) {
    let x = directionCoordPair[0], y = directionCoordPair[1];
    
    if (x > 0) return 'right';
    if (x < 0) return 'left';
    if (y > 0) return 'up';
    if (y < 0) return 'down';
    
    throw new Error(`Invalid coord pair ${x}, ${y}`);
  }
  
  function convertWordDirectionToCCWAngle(directionWord) {
    switch (directionWord) {
      case 'right': return 0;
      case 'up': return 1;
      case 'left': return 2;
      case 'down': return 3;
      default: throw new Error(`Invalid direction ${direction}`);
    }
  }
  
  function convertCCWAngleToWordDirection(ccwAngle) {
    switch (ccwAngle) {
      case 0: return 'right';
      case 1: return 'up';
      case 2: return 'left';
      case 3: return 'down';
      default: throw new Error(`Invalid angle ${ccwAngle}`);
    }
  }
  
  function directionWordIsHorizontal(directionWord) {
    return directionWord == 'left' || directionWord == 'right';
  }
  
  // returns the 90deg CCW angle between two angle words
  function angleBetweenWords(directionWordOne, directionWordTwo) {
    return ((convertWordDirectionToCCWAngle(directionWordTwo) - convertWordDirectionToCCWAngle(directionWordOne)) + 4) % 4;
  }
  
  return {
    getWorldSpaceCorner,
    calculateBaseTFromStartAndEndT,
    getEndingCoords,
    getShiftedCoordsBasedOnSide,
    convertWordDirectionToCoordPair,
    convertDirectionCoordPairToWord,
    convertWordDirectionToCCWAngle,
    convertCCWAngleToWordDirection,
    directionWordIsHorizontal,
    angleBetweenWords,
  };
})();
