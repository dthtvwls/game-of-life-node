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
  [0, 0, 0]
  [1, 1, 1]
  [0, 0, 0]
]

# swap
world2 = [
  [0, 0, 0]
  [1, 1, 1]
  [0, 0, 0]
]

sx = 2
sy = 2

neighbors = (y, x)->
  
  total = world[(y         )     ][(x + 1     ) % sx] +
          world[(y + 1     ) % sy][(x         )     ] +
          world[(y         )     ][(x - 1 + sx) % sx] +
          world[(y - 1 + sy) % sy][(x         )     ] +
          world[(y + 1     ) % sy][(x + 1     ) % sx] +
          world[(y + 1     ) % sy][(x - 1 + sx) % sx] +
          world[(y - 1 + sy) % sy][(x - 1 + sx) % sx] +
          world[(y - 1 + sy) % sy][(x + 1     ) % sx]
          
  console.log y+','+x+':'+total
          
  if world[y][x]
    return total == 3 || total == 2
  else
    return total == 3

do main = ->
  console.log world
  console.log new Date()

  for y in [0..2]
    for x in [0..2]
      world2[y][x] = neighbors y, x
      
  console.log world2
      
  io.sockets.emit 'world', world: world
  setTimeout main, 500
