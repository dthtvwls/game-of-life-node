# reserve 2d array by size and random-fill
module.exports.Matrix = Matrix = (y, x)->
  ary = Array y
  for item, i in ary
    ary[i] = Array x
    for item, j in ary[i]
      ary[i][j] = Math.round Math.random()



# whether a cell should be alive
alive = (world, y, x)->

  h = world.length    - 1
  w = world[0].length - 1
  
  # neighbor detection should wrap boundary
  y0 = if y > 0 then y - 1 else h
  y1 = if y < h then y + 1 else 0
  x0 = if x > 0 then x - 1 else w
  x1 = if x < w then x + 1 else 0
  
  # sum of living neighbors
  total =
    world[y0][x0] + world[y0][x ] + world[y0][x1] +
    world[y ][x0] +                 world[y ][x1] +
    world[y1][x0] + world[y1][x ] + world[y1][x1]

  # birth/death rules
  return 1 if total == 3
  return 1 if total == 2 && world[y][x]
  return 0



# iterate the world
module.exports.step = step = (world)->

  next = Matrix world.length, world[0].length

  for y in [0...world.length]
    for x in [0...world[0].length]
      next[y][x] = alive world, y, x

  return next
