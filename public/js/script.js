(function () {
  
  var socket = io.connect(location.origin),
      canvas = document.getElementById("canvas"),
      ctx    = canvas.getContext("2d"),
      rainbow  = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
      cellSize = 10,
      drawCell = function (x, y) {        
        ctx.fillStyle = rainbow[Math.round(Math.random() * 6)];
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      };
      
  canvas.addEventListener("mousemove", function (e) {
    var x = Math.floor((e.pageX - canvas.offsetLeft) / cellSize),
        y = Math.floor((e.pageY - canvas.offsetTop ) / cellSize);
        
    drawCell(x, y);
    socket.emit("cell", { x: x, y: y });
  }, false);

  socket.on("world", function (data) {

    var x, y, world = data.world;

    // white out the whole canvas
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    // World matrix is column-major
    for (y = 0; y < world.length; y++) {
      for (x = 0; x < world[y].length; x++) {
        if (world[y][x]) {
          // draw the cell if it is alive
          drawCell(x, y);
        }
      }
    }

  });
  
}());
