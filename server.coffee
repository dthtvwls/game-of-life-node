express = require 'express'
http    = require 'http'
lib     = require './lib'


#########################
# express/socket.io setup

app = express().configure ->
  @use express.logger 'dev'
  @use express.static 'public'
.configure 'development', ->
  @use express.errorHandler()

io = require('socket.io').listen http.createServer(app).listen 8888



# create the world
world = lib.Matrix 60, 60


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
