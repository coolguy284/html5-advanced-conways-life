let _module__c284_conway_js__traverser_class = (() => {
  let { CONSTANTS } = _module__c284_conway_js__constants;
  let {
    angleBetweenWords,
    convertDirectionCoordPairToWord,
    directionWordIsHorizontal,
  } = _module__c284_conway_js__helper_funcs;
  
  // simple object to move around on the board of a conwaysim object
  // this object is designed to be immutable, movement methods return a new traverser object
  class BoardTraverser {
    conwaySim;
    x;
    y;
    t;
    
    selfX_trueXScale = 1;
    selfX_trueYScale = 0;
    selfY_trueXScale = 0;
    selfY_trueYScale = 1;
    
    insideBoundary = false;
    boundaryObject;
    boundaryDisengageDirection;
    boundaryMovementDirection;
    boundaryRelPos;
    boundaryRelTime;
    
    constructor(
      conwaySim,
      x, y, t,
      selfX_trueXScale, selfX_trueYScale,
      selfY_trueXScale, selfY_trueYScale,
      insideBoundary,
      boundaryObject,
      boundaryDisengageDirection, boundaryMovementDirection,
      boundaryRelPos, boundaryRelTime
    ) {
      this.conwaySim = conwaySim;
      this.x = x;
      this.y = y;
      this.t = t;
      
      if (selfX_trueXScale != null) {
        this.selfX_trueXScale = selfX_trueXScale;
        this.selfX_trueYScale = selfX_trueYScale;
        this.selfY_trueXScale = selfY_trueXScale;
        this.selfY_trueYScale = selfY_trueYScale;
        
        this.insideBoundary = insideBoundary;
        this.boundaryObject = boundaryObject;
        this.boundaryDisengageDirection = boundaryDisengageDirection;
        this.boundaryMovementDirection = boundaryMovementDirection;
        this.boundaryRelPos = boundaryRelPos;
        this.boundaryRelTime = boundaryRelTime;
      }
    }
    
    getStateAt() {
      if (this.insideBoundary) {
        return this.boundaryObject.behaviorFunc(this.boundaryRelPos, this.boundaryRelTime);
      } else {
        return this.conwaySim.getStateAt(this.x, this.y, this.t);
      }
    }
    
    clone() {
      return new BoardTraverser(
        this.conwaySim,
        this.x, this.y, this.t,
        this.selfX_trueXScale, this.selfX_trueYScale,
        this.selfY_trueXScale, this.selfY_trueYScale,
        this.insideBoundary,
        this.boundaryObject,
        this.boundaryDisengageDirection, this.boundaryMovementDirection,
        this.boundaryRelPos, this.boundaryRelTime
      );
    }
    
    // returns new object with the given parameters replaced
    replaceParameters(parametersObject) {
      if (Object.keys(parametersObject).length == 0) {
        return this;
      } else {
        let newObject = this.clone();
        
        for (let parameter in parametersObject) {
          newObject[parameter] = parametersObject[parameter];
        }
        
        return newObject;
      }
    }
    
    // returns an object with intersection info if true, or null if not
    checkIfMovementDeltaIntersectsAnObject(x, y) {
      let movementIsHorizontal = x != 0;
      
      // for every simulation object
      for (let simObject of this.conwaySim.simulationObjects) {
        switch (simObject.type) {
          case 'boundary':
          case 'portal':
            // if its of the right type
            
            let [ shiftedStartingX, shiftedStartingY ] = getWorldSpaceCorner(simObject.startingX, simObject.startingY, 'bottom left');
            let [ shiftedEndingX, shiftedEndingY ] = getWorldSpaceCorner(
              ...getEndingCoords(simObject.startingX, simObject.startingY, simObject.direction, simObject.length),
              'bottom left'
            );
            
            // swap shifted values if they are in reverse order
            if (shiftedEndingX < shiftedStartingX) {
              [ shiftedStartingX, shiftedEndingX ] = [shiftedEndingX, shiftedStartingX];
            }
            if (shiftedEndingY < shiftedStartingY) {
              [ shiftedStartingY, shiftedEndingY ] = [shiftedEndingY, shiftedStartingY];
            }
            
            // if movement is horizontal
            if (movementIsHorizontal) {
              // and simulation object is perpendicular (vertical)
              if (simObject.direction == 'up' || simObject.direction == 'down') {
                // and simulation object is one step in front of object
                if (x > 0 && this.x + 0.5 == shiftedStartingX || x < 0 && this.x - 0.5 == shiftedStartingX) {
                  // and current y is within simulation object's bounds
                  if (this.y > shiftedStartingY && this.y < shiftedEndingY) {
                    // and simulation object direction, simulation object facing, and direction of traversal line up
                    if (CONSTANTS.COLLISION_MATRIX_HORIZONTAL[(simObject.direction == 'up') * 4 + (simObject.facing == 'right') * 2 + (x > 0)]) {
                      // then there was a collision
                      let positionAlongObject = simObject.startingY - this.y - 1;
                      
                      if (simObject.reversed) {
                        positionAlongObject = simObject.length - positionAlongObject - 1;
                      }
                      
                      let timeRelToObject = this.t - simObject.baseT;
                      
                      return {
                        object: simObject,
                        positionAlongObject,
                        timeRelToObject,
                      };
                    }
                  }
                }
              }
            } else {
              // or if movement is vertical
              
              // and simulation object is perpendicular (horizontal)
              if (simObject.direction == 'left' || simObject.direction == 'right') {
                // and simulation object is one step in front of object
                if (y > 0 && this.y + 0.5 == shiftedStartingY || y < 0 && this.y - 0.5 == shiftedStartingY) {
                  // and current x is within simulation object's bounds
                  if (this.x > shiftedStartingX && this.x < shiftedEndingX) {
                    // and simulation object direction, simulation object facing, and direction of traversal line up
                    if (CONSTANTS.COLLISION_MATRIX_VERTICAL[(simObject.direction == 'right') * 4 + (simObject.facing == 'right') * 2 + (y > 0)]) {
                      // then there was a collision
                      let positionAlongObject = simObject.startingX - this.x - 1;
                      
                      if (simObject.reversed) {
                        positionAlongObject = simObject.length - positionAlongObject - 1;
                      }
                      
                      let timeRelToObject = this.t - simObject.baseT;
                      
                      return {
                        object: simObject,
                        positionAlongObject,
                        timeRelToObject,
                      };
                    }
                  }
                }
              }
            }
        }
      }
            
      // otherwise there was no collision
      return null;
    }
    
    // these functions are only intended to move in a single cartesian direction by 1
    
    // underlying movement and transformation functions
    
    moveTo(x, y) {
      return this.replaceParameters({ x, y });
    }
    
    moveToWithTime(x, y, t) {
      return this.replaceParameters({ x, y, t });
    }
    
    trueMoveBy(x, y) {
      let movementDirectionWord = convertDirectionCoordPairToWord([x, y]);
      
      if (!this.insideBoundary) {
        // normal movement logic if outside boundary
        
        let collisionInfo = this.checkIfMovementDeltaIntersectsAnObject(x, y);
        
        if (collisionInfo != null) {
          // perform traversal behavior through object if there is an object
          
          switch (collisionInfo.object.type) {
            case 'boundary':
              // boundary traversal behavior
              
              return this.replaceParameters({
                insideBoundary: true,
                boundaryObject: collisionInfo.object,
                boundaryDisengageDirection: convertDirectionCoordPairToWord([-x, -y]),
                boundaryMovementDirection: collisionInfo.object.direction,
                boundaryRelPos: collisionInfo.positionAlongObject,
                boundaryRelTime: collisionInfo.timeRelToObject,
              });
            
            case 'portal':
              // portal behavior
              
              // save portal to object for use
              let currentPortal = collisionInfo.object;
              
              // find corresponding portal
              let otherPortal = this.conwaySim.simulationObjects[currentPortal.links[0].id];
              
              // rotate coord system of traverser from direction entering portal to directing leaving portal, then possibly apply a flip in the perpendicular direction if needed
              
              let exitInfo = this.conwaySim.objectRelPosToTruePos(otherPortal, collisionInfo.positionAlongObject, collisionInfo.timeRelToObject);
              
              let newTraverser = this;
              
              // rotate
              let rotationAngle = angleBetweenWords(movementDirectionWord, exitInfo.direction);
              newTraverser = newTraverser.rotate(rotationAngle);
              
              // flip if needed
              let currentPortalParity = this.conwaySim.getPortalParity(currentPortal);
              let otherPortalParity = this.conwaySim.getPortalParity(otherPortal);
              
              if (currentPortalParity != otherPortalParity) {
                let parallelDirectionIsHorizontal = directionWordIsHorizontal(movementDirectionWord);
                
                if (parallelDirectionIsHorizontal) {
                  newTraverser = newTraverser.flipY();
                } else {
                  newTraverser = newTraverser.flipX();
                }
              }
              
              // and of course, set position to new x and y
              newTraverser = newTraverser.moveToWithTime(exitInfo.x, exitInfo.y, exitInfo.t);
              
              return newTraverser;
            
            default:
              // take no action if unknown object type
              return this;
          }
        } else {
          // standard movement if no object
          
          return this.replaceParameters({
            x: this.x + x,
            y: this.y + y,
          });
        }
      } else {
        // inside boundary
        
        if (movementDirectionWord == this.boundaryDisengageDirection) {
          // if travelling in boundary disengage direction, dont change position, just disengage
          return this.replaceParameters({
            insideBoundary: false,
            boundaryObject: null,
            boundaryDisengageDirection: null,
            boundaryMovementDirection: null,
            boundaryRelPos: null,
            boundaryRelTime: null,
          });
        } else {
          // otherwise only register movement along boundary
          if (directionWordIsHorizontal(this.boundaryMovementDirection)) {
            if (directionWordIsHorizontal(movementDirectionWord)) {
              if (this.boundaryMovementDirection == movementDirectionWord) {
                return this.replaceParameters({
                  x: this.x + x,
                  boundaryRelPos: this.boundaryRelPos + 1,
                });
              } else {
                return this.replaceParameters({
                  x: this.x + x,
                  boundaryRelPos: this.boundaryRelPos - 1,
                });
              }
            } else {
              // do nothing
              return this;
            }
          } else {
            if (directionWordIsHorizontal(movementDirectionWord)) {
              // do nothing
              return this;
            } else {
              if (this.boundaryMovementDirection == movementDirectionWord) {
                return this.replaceParameters({
                  y: this.y + y,
                  boundaryRelPos: this.boundaryRelPos + 1,
                });
              } else {
                return this.replaceParameters({
                  y: this.y + y,
                  boundaryRelPos: this.boundaryRelPos - 1,
                });
              }
            }
          }
        }
      }
    }
    
    rotate(multipleOf90CCW) {
      switch (multipleOf90CCW) {
        case 0:
          return this;
        
        case 1:
          return this.replaceParameters({
            selfX_trueXScale: -this.selfX_trueYScale,
            selfX_trueYScale: this.selfX_trueXScale,
            selfY_trueXScale: -this.selfY_trueYScale,
            selfY_trueYScale: this.selfY_trueXScale,
          });
        
        case 2:
          return this.replaceParameters({
            selfX_trueXScale: -this.selfX_trueXScale,
            selfX_trueYScale: -this.selfX_trueYScale,
            selfY_trueXScale: -this.selfY_trueXScale,
            selfY_trueYScale: -this.selfY_trueYScale,
          });
        
        case 3:
          return this.replaceParameters({
            selfX_trueXScale: this.selfX_trueYScale,
            selfX_trueYScale: -this.selfX_trueXScale,
            selfY_trueXScale: this.selfY_trueYScale,
            selfY_trueYScale: -this.selfY_trueXScale,
          });
      }
    }
    
    flipX() {
      return this.replaceParameters({
        selfX_trueXScale: -this.selfX_trueXScale,
        selfX_trueYScale: this.selfX_trueYScale,
        selfY_trueXScale: -this.selfY_trueXScale,
        selfY_trueYScale: this.selfY_trueYScale,
      });
    }
    
    flipY() {
      return this.replaceParameters({
        selfX_trueXScale: this.selfX_trueXScale,
        selfX_trueYScale: -this.selfX_trueYScale,
        selfY_trueXScale: this.selfY_trueXScale,
        selfY_trueYScale: -this.selfY_trueYScale,
      });
    }
    
    // helper functions
    
    getTrueMovementDelta(x, y) {
      return [
        this.selfX_trueXScale * x + this.selfY_trueXScale * y,
        this.selfX_trueYScale * x + this.selfY_trueYScale * y,
      ];
    }
    
    // relative movement functions
    
    moveBy(x, y) {
      // for now simply step in the given direction applying rotation and scale
      
      return this.trueMoveBy(...this.getTrueMovementDelta(x, y));
    }
    
    moveLeft() { return this.moveBy(-1, 0); }
    moveRight() { return this.moveBy(1, 0); }
    moveUp() { return this.moveBy(0, 1); }
    moveDown() { return this.moveBy(0, -1); }
  }
  
  return {
    BoardTraverser,
  };
})();
