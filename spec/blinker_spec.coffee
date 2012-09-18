describe "blinker", ->
  it "should move correctly", ->

    step0 = [
      [0, 0, 0, 0]
      [1, 1, 1, 0]
      [0, 0, 0, 0]
      [0, 0, 0, 0]
    ]

    step1 = [
      [0, 1, 0, 0]
      [0, 1, 0, 0]
      [0, 1, 0, 0]
      [0, 0, 0, 0]
    ]

    expect(lib.step(step0)).toEqual step1
