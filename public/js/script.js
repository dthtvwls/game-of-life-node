(function () {
  
  var socket     = io.connect(location.origin),
      canvas     = document.getElementById("canvas"),
      canvasCtx  = canvas.getContext("2d"),
      audioCtx   = new webkitAudioContext();
      audioNode  = audioCtx.createJavaScriptNode(1024, 1, 1);
      rainbow    = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
      cellSize   = 10,
      sine       = 0,
      scale      = [523.25, 587.33, 659.26, 698.46, 783.99, 880.00, 987.77],
      frequency  = audioCtx.sampleRate / (440 * Math.PI),
      drawCell   = function (x, y) {        
        canvasCtx.fillStyle = rainbow[Math.round(Math.random() * 6)];
        canvasCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      };
  
  audioNode.onaudioprocess = function (e) {
    var i, data = e.outputBuffer.getChannelData(0);
    for (i = 0; i < data.length; ++i) {
      data[i] = Math.sin(sine++ / frequency);
    }
  };
  audioNode.connect(audioCtx.destination);
      
  canvas.addEventListener("mousemove", function (e) {
    var x = Math.floor((e.pageX - canvas.offsetLeft) / cellSize),
        y = Math.floor((e.pageY - canvas.offsetTop ) / cellSize);
        
    drawCell(x, y);
    socket.emit("cell", { x: x, y: y });
  }, false);

  socket.on("world", function (data) {
    
    frequency = audioCtx.sampleRate / (scale[Math.round(Math.random() * 6)] * Math.PI);

    var x, y, world = data.world;

    // white out the whole canvas
    canvasCtx.fillStyle = "white";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

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
