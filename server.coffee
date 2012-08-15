express = require 'express'
http = require 'http'
_ = require 'lodash'

app = express().configure ->
  @use express.logger 'dev'
  @use express.bodyParser()
  @use express.methodOverride()
  @use @router
  @use express.static 'public'
.configure 'development', ->
  @use express.errorHandler()

server = http.createServer(app).listen process.env.PORT || 8888

io = require('socket.io').listen server


# world matrix (take note, it is column-major!)
world = [
  [0, 0, 0, 0, 0]
  [0, 0, 1, 0, 0]
  [0, 0, 0, 1, 0]
  [0, 1, 1, 1, 0]
  [0, 0, 0, 0, 0]
]

# swap
new_world = [
  [0, 0, 0, 0, 0]
  [0, 0, 0, 0, 0]
  [0, 0, 0, 0, 0]
  [0, 0, 0, 0, 0]
  [0, 0, 0, 0, 0]
]

alive = (y, x)->
  
  y0 = if y > 0 then y - 1 else 4
  y1 = if y < 4 then y + 1 else 0
  x0 = if x > 0 then x - 1 else 4
  x1 = if x < 4 then x + 1 else 0
  
  total = world[y ][x0] +
          world[y ][x1] +
          world[y0][x ] +
          world[y0][x0] +
          world[y0][x1] +
          world[y1][x ] +
          world[y1][x0] +
          world[y1][x1]

  return 1 if total == 3
  return 1 if total == 2 && world[y][x]
  return 0

do main = ->

  for y in [0..4]
    for x in [0..4]
      new_world[y][x] = alive y, x
  
  # ref swap
  tmp = world
  world = new_world
  new_world = tmp
      
  io.sockets.emit 'world', world: world
  setTimeout main, 500
