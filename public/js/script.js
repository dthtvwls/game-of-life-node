(function () {
  "use strict";
  
  var socket    = io.connect(location.origin),
      canvas    = document.getElementById("canvas"),
      canvasCtx = canvas.getContext("2d"),
      roygbiv   = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
      rgb       = ["red", "green", "blue"],
      cmyk      = ["cyan", "magenta", "yellow", "black"],
      rgbcmyk   = ["red", "green", "blue", "cyan", "magenta", "yellow", "black"],
      cellSize  = 10,
      drawCell  = null;
  
  drawCell = function (x, y) {        
    canvasCtx.fillStyle = rgbcmyk[Math.round(Math.random() * 5)];
    canvasCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  };
  
  // mouse moves over canvas
  canvas.addEventListener("mousemove", function (e) {
    // calculate coords from mouse pos
    var x = Math.floor((e.pageX - canvas.offsetLeft) / cellSize),
        y = Math.floor((e.pageY - canvas.offsetTop ) / cellSize);
    
    // send the cell to the server
    socket.emit("cell", { x: x, y: y });
  }, false);

  // receive server data via socket.io
  socket.on("world", function (data) {

    var x, y, world = data.world;

    // white out the whole canvas
    canvasCtx.fillStyle = "white";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // World matrix is column-major
    for (y = 0; y < world.length; y++) {
      for (x = 0; x < world[y].length; x++) {
        // draw the cell if it is alive
        if (world[y][x]) drawCell(x, y);
      }
    }

  });
  
}());
