describe "pack", ->
  it "32x32 matrix of 1 should be max", ->
    matrix = lib.pack lib.Matrix 32, 32
    expect(matrix).toEqual Number.MAX_VALUE
    
  it "max should be 32x32 matrix of 1", ->
    value = lib.unpack Number.MAX_VALUE
    expect(value).toEqual lib.Matrix 32, 32, 1
