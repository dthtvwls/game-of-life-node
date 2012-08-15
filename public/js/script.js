(function () {
  
  var socket = io.connect(location.origin),
      canvas = document.getElementById("canvas"),
      ctx    = canvas.getContext("2d"),
      cellSize = 10;

  socket.on('world', function (data) {

    var x, y, world = data.world;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";

    // World matrix is column-major! So everything is y, x until...
    for (y = 0; y < world.length; y++) {
      for (x = 0; x < world[y].length; x++) {

        console.log('world['+y+']['+x+']:'+world[y][x]);

        if (world[y][x]) {
          // The actual drawing takes place when it is x, y
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

  });
  
}());
