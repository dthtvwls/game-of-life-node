express = require 'express'
app     = express()
server  = require('http').Server(app)
io      = require('socket.io')(server)

server.listen 8888

app.use express.static 'public'


# create the world
lib   = require './lib'
world = lib.Matrix 32, 32


# main loop
setInterval ->

  world = lib.step world

  io.sockets.emit 'world', world: world

, 100


####################
# socket.io handlers

io.sockets.on 'connection', (socket)->
  # receive cells from client
  socket.on 'cell', (data)->
    unless data.y >= world.length || data.x >= world[0].length
      world[data.y][data.x] = 1
