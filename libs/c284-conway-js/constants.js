let _module__c284_conway_js__constants = (() => {
  let CONSTANTS = {
    COLLISION_MATRIX_HORIZONTAL: [
      // contains cases that constitute a collision with object when traversing horizontally
      //    SIMOBJ_DIR SIMOBJ_FACING X_POS
      1, // down       left          false
      0, // down       left          true
      0, // down       right         false
      1, // down       right         true
      0, // up         left          false
      1, // up         left          true
      1, // up         right         false
      0, // up         right         true
    ],
    COLLISION_MATRIX_VERTICAL: [
      // contains cases that constitute a collision with object when traversing vertically
      //    SIMOBJ_DIR SIMOBJ_FACING Y_POS
      0, // left       left          false
      1, // left       left          true
      1, // left       right         false
      0, // left       right         true
      1, // right      left          false
      0, // right      left          true
      0, // right      right         false
      1, // right      right         true
    ],
    GC_IDLE_TIME: null,
    LOCK_IN_IDLE_TIME: null,
  };
  
  function getConstants() {
    return {
      GC_IDLE_TIME: CONSTANTS.GC_IDLE_TIME,
      LOCK_IN_IDLE_TIME: CONSTANTS.LOCK_IN_IDLE_TIME,
    }
  }
  
  function setConstants(GC_IDLE_TIME, LOCK_IN_IDLE_TIME) {
    CONSTANTS.GC_IDLE_TIME = GC_IDLE_TIME;
    CONSTANTS.LOCK_IN_IDLE_TIME = LOCK_IN_IDLE_TIME;
  }
  
  return {
    CONSTANTS,
    getConstants,
    setConstants,
  }
})();
