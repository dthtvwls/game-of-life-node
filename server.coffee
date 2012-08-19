#cluster = require 'cluster'
express = require 'express'
http    = require 'http'
#_       = require 'lodash'
#redis   = require 'redis'

app = express().configure ->
  @use express.logger 'dev'
  @use express.bodyParser()
  @use express.methodOverride()
  @use @router
  @use express.static 'public'
.configure 'development', ->
  @use express.errorHandler()

io = require('socket.io').listen http.createServer(app).listen process.env.PORT || 8888

# reserve 2d array by size, and random-fill
Matrix = (y, x)->
  ary = Array y
  for item, i in ary
    ary[i] = Array x
    for item, j in ary[i]
      ary[i][j] = Math.round Math.random()
  
world = Matrix 60, 60
next  = Matrix 60, 60

h = world.length - 1
w = world[h].length - 1

# whether a cell should be alive
alive = (y, x)->
  
  # neighbor detection should wrap boundary
  y0 = if y > 0 then y - 1 else h
  y1 = if y < h then y + 1 else 0
  x0 = if x > 0 then x - 1 else w
  x1 = if x < w then x + 1 else 0
  
  # sum of living neighbors
  total = world[y ][x0] + world[y ][x1] +
          world[y0][x ] + world[y1][x ] +
          world[y0][x0] + world[y0][x1] +
          world[y1][x0] + world[y1][x1]

  return 1 if total == 3
  return 1 if total == 2 && world[y][x]
  return 0

setInterval ->

  for y in [0..h]
    for x in [0..w]
      next[y][x] = alive y, x

  # ref swap
  tmp   = world
  world = next
  next  = tmp

  io.sockets.emit 'world', world: world

, 100

io.sockets.on 'connection', (socket)->
  socket.on 'cell', (data)->    
    unless data.y > h || data.x > w
      world[data.y][data.x] = 1
