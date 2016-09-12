// ---------- view block -------------
  var view = {
    movePlayer: function(player){
      player.style.top = model.playerCoords.top + "px";
      player.style.left = model.playerCoords.left + "px";
      player.setAttribute("class", player.faceSide );
    },
    clearAnim: function(player) {
      player.setAttribute("class", "");
    }
  };
//------------ end view block ---------

// ------------ model block -------------
  var model = {
    rightPressed: false,
    leftPressed: false,
    upPressed: false,
    downPressed: false,
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
    mainMoving: function(){
       model.getPlayerCoords("player");
       var localWalls = model.walls;
      for (var i = 0; i < localWalls.length; i++) {
        var collisionObj = model.macroCollisionSides(model.playerCoords, localWalls[i]);
        if (collisionObj !== undefined) break;
      }
      model.makeStep(model.playerCoords, localWalls[i], collisionObj);
    },
    makeStep: function(obj1, obj2,collisionValue) {
      switch (collisionValue) {
        case "bottom":
          model.playerCoords.top = obj2.top - model.playerCoords.height;
          break;
        case "left":
          model.playerCoords.left = obj2.left + obj2.width;
        break;
        case "top":
          model.playerCoords.top = obj2.top + obj2.height;
        break;
        case "right":
          model.playerCoords.left = obj2.left - model.playerCoords.width;
        break;
      }
      if (collisionValue === undefined) {
        if (model.leftPressed) {
          model.playerCoords.left -= 25;
          model.player.faceSide = "moveLeft";
          view.movePlayer(model.player);
        }
        else if (model.upPressed) {
          model.playerCoords.top -= 25;
          model.player.faceSide = "moveUp";
          view.movePlayer(model.player);
        }
        else if (model.rightPressed) {
          model.playerCoords.left += 25;
          model.player.faceSide = "moveRight";
          view.movePlayer(model.player);
        }
        else if (model.downPressed) {
          model.playerCoords.top += 25;
          model.player.faceSide = "moveDown";
          view.movePlayer(model.player);
        }
        else {
          view.movePlayer(model.player);
          view.clearAnim(model.player);
        }
      }
      else{
        if (model.leftPressed && collisionValue !== "left") {
          model.playerCoords.left -= 25;
          model.player.faceSide = "moveLeft";
          view.movePlayer(model.player);
        }
        else if (model.upPressed && collisionValue !== "top") {
          model.playerCoords.top -= 25;
          model.player.faceSide = "moveUp";
          view.movePlayer(model.player);
        }
        else if (model.rightPressed && collisionValue !== "right") {
          model.playerCoords.left += 25;
          model.player.faceSide = "moveRight";
          view.movePlayer(model.player);
        }
        else if (model.downPressed && collisionValue !== "bottom") {
          model.playerCoords.top += 25;
          model.player.faceSide = "moveDown";
          view.movePlayer(model.player);
        }
        else {
          view.movePlayer(model.player);
          view.clearAnim(model.player);
        }
      }
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
      var gameArea = model.area;
      elemCoords = document.getElementById(elem).getBoundingClientRect();
      model.playerCoords.top = elemCoords.top -= gameArea.top;
      model.playerCoords.left = elemCoords.left -= gameArea.left;
      model.playerCoords.width = elemCoords.width;
      model.playerCoords.height = elemCoords.height;
    }
  };
// ----------end model block ------------
// ----------- controller block -------
  var controller = {
    keyDownHandler: function(e) {
      if(e.keyCode == 39) {
          model.rightPressed = true;
      }
      else if(e.keyCode == 37) {
          model.leftPressed = true;
      }
      else if(e.keyCode == 38) {
          model.upPressed = true;
      }
      else if(e.keyCode == 40) {
          model.downPressed = true;
      }
    },
    keyUpHandler: function(e) {
      if(e.keyCode == 39) {
          model.rightPressed = false;
      }
      else if(e.keyCode == 37) {
          model.leftPressed = false;
      }
      else if(e.keyCode == 38) {
          model.upPressed = false;
      }
      else if(e.keyCode == 40) {
          model.downPressed = false;
      }
    }
  };
// ----------- end controller -------

// -------- init function ---------
(function() {
  var app = {
    init: function() {
      for (var i = 0; i < model.walls.length; i ++) {
        model.createWallElem(model.walls[i]);
        //model.getTrueCoords(model.walls[i]);
      }
      this.main();
      this.event();
    },
    main: function() {
      setInterval(model.mainMoving, 50);
    },
    event: function() {
      document.addEventListener("keydown", controller.keyDownHandler, false);
      document.addEventListener("keyup", controller.keyUpHandler, false);
    }
  }
   app.init();
}());
// -------- end init -------------
