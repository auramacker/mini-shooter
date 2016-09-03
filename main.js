// ---------- view block -------------
  var view = {
    movePlayer: function(player, coords){
      player.style.top = model.playerCoords.top + "px";
      player.style.left = model.playerCoords.left + "px";
      player.setAttribute("class", player.faceSide );
      setTimeout(function(){
        player.setAttribute("class", "");
      }, 250);
    }
  };
//------------ end view block ---------

// ------------ model block -------------
  var model = {
    area: document.getElementById("game-area").getBoundingClientRect(),
    player: document.getElementById("player"),
    playerCoords: {},
    walls: [
      {name: "wall1", left: 50, top: 100, width: 70, height: 70},
      {name: "wall2", left: 250, top: 200, width: 70, height: 70},
      {name: "wall3", left: 100, top: 300, width: 70, height: 70},
      {name: "wall4", left: 20, top: 600, width: 70, height: 70},
      {name: "wall5", left: 650, top: 200, width: 70, height: 70},
      {name: "wall6", left: 650, top: 400, width: 70, height: 70}
    ],
    mainMoving: function(button){
      this.getPlayerCoords("player");
      console.log(this.playerCoords);
      var localWalls = this.walls;
      for (var i = 0; i < localWalls.length; i++) {
        var collisionObj = this.macroCollisionSides(this.playerCoords, localWalls[i]);
        if (collisionObj !== undefined) break;
      }
      console.log(collisionObj);
      this.makeStep(this.playerCoords, localWalls[i], button, collisionObj);
    },
    makeStep: function(obj1, obj2, button,collisionValue) {
      switch (collisionValue) {
        case "bottom":
          this.playerCoords.top = obj2.top - this.playerCoords.height;
          break;
        case "left":
          this.playerCoords.left = obj2.left + obj2.width;
        break;
        case "top":
          this.playerCoords.top = obj2.top + obj2.height;
        break;
        case "right":
          this.playerCoords.left = obj2.left - this.playerCoords.width;
        break;
      }
      if (collisionValue === undefined) {
        if (button == 65) {
          this.playerCoords.left -= 25;
          this.player.faceSide = "moveLeft";
        }
        else if (button == 87) {
          this.playerCoords.top -= 25;
          this.player.faceSide = "moveUp";
        }
        else if (button == 68) {
          this.playerCoords.left += 25;
          this.player.faceSide = "moveRight";
        }
        else if (button == 83) {
          this.playerCoords.top += 25;
          this.player.faceSide = "moveDown";
        }
      }
      else {
        if (button == 65 && collisionValue !== "left") {
          this.playerCoords.left -= 25;
          this.player.faceSide = "moveLeft";
        }
        else if (button == 87 && collisionValue !== "top") {
          this.playerCoords.top -= 25;
          this.player.faceSide = "moveUp";
        }
        else if (button == 68 && collisionValue !== "right") {
          this.playerCoords.left += 25;
          this.player.faceSide = "moveRight";
        }
        else if (button == 83 && collisionValue !== "bottom") {
          this.playerCoords.top += 25;
          this.player.faceSide = "moveDown";
        }
      }
      console.log(collisionValue);
    },
    macroCollisionSides: function(obj1, obj2){
      var collision;

      if ((obj1.left + obj1.width >= obj2.left) && (obj1.left <= obj2.left + obj2.width ) && (obj1.top + obj1.height >= obj2.top) && (obj1.top + obj1.height <= obj2.top + (obj2.height/3))) {
        collision = "bottom";
      }
      if ((obj1.top + obj1.height >= obj2.top) && (obj1.top <= obj2.top + obj2.height) && (obj1.left <= obj2.left + obj2.width) && (obj1.left >= (obj2.left + obj2.width) - (obj2.width/3))) {
        collision = "left";
      }
      if ((obj1.left + obj1.width >= obj2.left) && (obj1.left <= obj2.left + obj2.width) && (obj1.top <= obj2.top + obj2.height) && (obj1.top >= (obj2.top + obj2.height) - (obj2.height/3))) {
        collision = "top";
      }
      if ((obj1.top + obj1.height >= obj2.top) && (obj1.top <= obj2.top + obj2.height) && (obj1.left + obj1.width >= obj2.left) && (obj1.left + obj1.width <= obj2.left + (obj2.width/3))) {
        collision = "right";
      }
      return collision
    },
    macroCollision: function(obj1,obj2){
      var XColl=false;
      var YColl=false;

      if ((obj1.left + obj1.width >= obj2.left) && (obj1.left <= obj2.left + obj2.width)) XColl = true;
      if ((obj1.top + obj1.height >= obj2.top) && (obj1.top <= obj2.top + obj2.height)) YColl = true;

      if (XColl&YColl){return true;}
      else {
        return false;
      }
    },
    getTrueCoords: function(element){
      element.top -= this.area.top;
      element.left -= this.area.left;
    },
    createWallElem: function(element){
      var parentElem = document.getElementById("game-area");
      var newElem = document.createElement("div");
      newElem.setAttribute("class", "wall");
      newElem.setAttribute("id", element.name);
      newElem.style.left = element.left + "px";
      newElem.style.top = element.top + "px";
      newElem.style.width = element.width + "px";
      newElem.style.height = element.height + "px";
      parentElem.appendChild(newElem);
    },
    getPlayerCoords: function(elem) { // count relative coordinates
      var gameArea = this.area;
      elemCoords = document.getElementById(elem).getBoundingClientRect();
      this.playerCoords.top = elemCoords.top -= gameArea.top;
      this.playerCoords.left = elemCoords.left -= gameArea.left;
      this.playerCoords.width = elemCoords.width;
      this.playerCoords.height = elemCoords.height;
    }
  };
// ----------end model block ------------

// ----------- controller block -------
  var controller = {
    keyHandler: function(key){
      if (key !== null ) {
        var moveInterval = setInterval(function(){
          model.mainMoving(key);
          view.movePlayer(model.player, model.playerCoords);
        }, 100);
      }
      else {
        clearInterval(moveInterval);
      }

    }
  };
// ----------- end controller -------

// -------- init function ---------
(function() {
  var app = {
    init: function() {
      this.main();
      this.event();
      for (var i = 0; i < model.walls.length; i ++) {
        model.createWallElem(model.walls[i]);
        //model.getTrueCoords(model.walls[i]);
      }
    },
    main: function() {
    },
    event: function() {
      window.onkeydown = function(){
        controller.keyHandler(event.keyCode);
      }
      window.onkeyup = function(){
        controller.keyHandler(null);
      }
    }
  }
   app.init();
}());
// -------- end init -------------
