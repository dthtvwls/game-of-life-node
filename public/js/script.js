(function () {
  "use strict";
  
  var socket    = io.connect(location.origin),
      canvas    = document.getElementById("canvas"),
      canvasCtx = canvas.getContext("2d"),
      audioCtx  = new webkitAudioContext(),
      audioNode = audioCtx.createJavaScriptNode(1024, 1, 1),
      rainbow   = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
      rgb       = ["red", "green", "blue"],
      cmyk      = ["cyan", "magenta", "yellow", "black"],
      custom    = ["red", "green", "blue", "cyan", "magenta", "yellow", "black"],
      cellSize  = 10,
      sine      = 0,
      frequency = function (freq) {
        return audioCtx.sampleRate / (freq * 2 * Math.PI);
      },
      scale     = [
        frequency(523.25),
        frequency(587.33),
        frequency(659.26),
        frequency(698.46),
        frequency(783.99),
        frequency(880.00),
        frequency(987.77)
      ],
      current   = scale[0],
      playNote  = null,
      drawCell  = null;
  
  audioNode.connect(audioCtx.destination);
  audioNode.onaudioprocess = function (e) {
    var i, data = e.outputBuffer.getChannelData(0), len = data.length;
    for (i = 0; i < len; ++i) {
      data[i] = Math.sin(sine++ / current);
    }
  };
  
  playNote = function (i) {
    current = scale[i];
    //audioNode.connect(audioCtx.destination);
    //setTimeout(function () { audioNode.disconnect(); }, 500);
  };
  
  drawCell = function (x, y) {        
    canvasCtx.fillStyle = custom[Math.round(Math.random() * 5)];
    canvasCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  };
    
  canvas.addEventListener("mousemove", function (e) {
    var x = Math.floor((e.pageX - canvas.offsetLeft) / cellSize),
        y = Math.floor((e.pageY - canvas.offsetTop ) / cellSize);
        
    drawCell(x, y);
    socket.emit("cell", { x: x, y: y });
  }, false);

  socket.on("world", function (data) {
    
    //frequency = audioCtx.sampleRate / (scale[Math.round(Math.random() * 6)] * 2 * Math.PI);
    playNote(Math.round(Math.random() * 6));

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
