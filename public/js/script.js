var socket = io.connect(location.origin);

var ctx = document.getElementById("canvas").getContext("2d");
var cellSize = 10;

socket.on('world', function (data) {
  
  var x, y, world = data.world;
  
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
