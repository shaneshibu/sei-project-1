const height = 20
const width = 10
const squares = []
let playerIndexes = []
let previousIndexes = []
let dropTimerId = null
let canMoveCheckTimerId = null
const colors = ['red', 'green', 'blue', 'yellow']
const shapeNames = ['I', 'O', 'T', 'J', 'L', 'S', 'Z']
let activeShape = null

class Tetromino {
  constructor(name) {
    this.name = name
    this.initialPosition(name)
    this.orientation = 0
  }
  initialPosition(name) {
    const initialPositions = {
      I: [3, 4, 5, 6],
      O: [4, 5, 14, 15],
      T: [4, 13, 14, 15],
      J: [3, 13, 14, 15],
      L: [5, 13, 14, 15],
      S: [5, 6, 14, 15],
      Z: [4, 5, 15, 16]
    }
    this.positions = initialPositions[name]
  }
  rotate(indexes) {
    const pos1 = indexes[0]
    const pos2 = indexes[1]
    const pos3 = indexes[2]
    const pos4 = indexes[3]
    const rotatedPositions = {
      I: {
        0: [],
        90: [],
        180: [],
        270: []
      },
      T: {
        0: [pos4, pos1, pos3, pos3 + width],
        90: [pos4, pos1, pos3, pos3 - 1],
        180: [pos4, pos1, pos3, pos3 - width],
        270: [pos4, pos1, pos3, pos3 + 1]
      },
      J: {
        0: [],
        90: [],
        180: [],
        270: []
      },
      L: {
        0: [],
        90: [],
        180: [],
        270: []
      },
      S: {
        0: [],
        90: [],
        180: [],
        270: []
      },
      Z: {
        0: [],
        90: [],
        180: [],
        270: []
      }
    }
    // console.log('hello' + this.positions)
    //this.positions = []
    this.positions[0] = rotatedPositions[this.name][this.orientation][0]
    this.positions[1] = rotatedPositions[this.name][this.orientation][1]
    this.positions[2] = rotatedPositions[this.name][this.orientation][2]
    this.positions[3] = rotatedPositions[this.name][this.orientation][3]
    // console.log(this.positions)
    this.orientation !== 270 ? this.orientation += 90 : this.orientation = 0

    return this.positions
  }
}



function init() {
  // console.log()
  const grid = document.querySelector('#grid')

  function generateGrid() {

    for (var i = 0; i < width * height; i++) {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.append(square)
    }

  }

  function generateNewShape() {

    activeShape = new Tetromino(shapeNames[Math.floor(Math.random() * shapeNames.length)])
    // const color = colors[Math.floor(Math.random() * 4)]
    playerIndexes = []
    activeShape.positions.forEach(position => playerIndexes.push(position))
    for (var i = 0; i < playerIndexes.length; i++) {
      squares[playerIndexes[i]].classList.add('shape')
      // squares[playerIndexes[i]].classList.add(color)
      // console.log(squares)
    }
  }

  function freezeCurrentShape() {

    for (var i = 0; i < playerIndexes.length; i++) {
      squares[playerIndexes[i]].classList.replace('shape', 'shape-inactive')
      // squares[playerIndexes[i]].classList.add(color)
      // console.log(squares)
    }
  }

  function isOccupied(num) {
    return squares[num].classList.contains('shape-inactive')
  }

  function canGoLeft() {
    // playerIndexes.forEach((index) => {
    //   if (!(index % width > 0)) {
    //     return false
    //   }
    // })
    for (var i = 0; i < playerIndexes.length; i++) {
      const position = playerIndexes[i]
      if (!(position % width > 0) || isOccupied(position-1)) {
        return false
      }
    }
    return true
  }

  function canGoRight() {
    // playerIndexes.forEach((index) => {
    //   if (!(index % width < width - 1)) {
    //     return false
    //   }
    // })
    for (var i = 0; i < playerIndexes.length; i++) {
      const position = playerIndexes[i]
      // console.log(squares[position].classList)
      if (!(position % width < width - 1) || isOccupied(position+1)) {
        return false
      }
    }
    return true
    // return playerIndexes[0] % width < width - 1 ? true : false
  }

  function canGoDown() {
    for (var i = 0; i < playerIndexes.length; i++) {
      const position = playerIndexes[i]
      if (!(position + width < width * height) || isOccupied(position+width)) {
        return false
      }
    }
    return true
  }

  function moveDown() {
    for (var i = 0; i < playerIndexes.length; i++) {
      playerIndexes[i] += width
    }
  }

  function updateGrid(indexes) {
    // squares.forEach(square => square.classList.remove('shape'))
    //indexes.forEach(index => squares[index])
    for (var i = 0; i < indexes.length; i++) {
      squares[indexes[i]].classList.remove('shape')
      // console.log(squares[indexes[i]])
    }

    playerIndexes.forEach(index => squares[index].classList.add('shape'))
    console.log('updating grid ' + indexes)
  }


  function handleKeyDown(e) {
    let rotatedPositions = null
    // console.log(e.key)
    savePreviousPosition(playerIndexes)
    let playerShouldMove = true
    switch (e.key) {
      case 'ArrowLeft':
        if (canGoLeft()) {
          for (var i = 0; i < playerIndexes.length; i++) {
            playerIndexes[i]--
          }
          // console.log(canGoLeft())
        }
        break
      case 'ArrowRight':
        if (canGoRight()) {
          for (var i = 0; i < playerIndexes.length; i++) {
            playerIndexes[i]++
          }
        }
        // console.log(canGoRight())
        break
      case 'ArrowUp':
        if (activeShape.name !== 'O') {
          rotatedPositions = activeShape.rotate(playerIndexes).slice()
          playerIndexes = []
          rotatedPositions.forEach(position => playerIndexes.push(position))
        }
        break
      case 'ArrowDown':
        if (canGoDown()) {
          moveDown()
          // playerIndexes.forEach(item => {item += width})
        } else {

        }
        break
      default:
        console.log('was not arrow')
        playerShouldMove = false
    }
    // console.log(previousIndexes)
    // console.log(playerIndexes)
    if (playerShouldMove) updateGrid(previousIndexes)
  }

  function savePreviousPosition(indexes) {
    for (var i = 0; i < indexes.length; i++) {
      previousIndexes[i] = indexes[i]
    }
  }

  function dropShapes() {

    canMoveCheckTimerId = setInterval(() => {
      if (!canGoDown()) {
        freezeCurrentShape()
        generateNewShape()
      }
    },100)

    dropTimerId = setInterval(() => {
      savePreviousPosition(playerIndexes)
      moveDown()
      updateGrid(previousIndexes)
    }, 2000)

  }

  generateGrid()
  generateNewShape()
  // moveShape()
  dropShapes()


  window.addEventListener('keydown', handleKeyDown)
}

window.addEventListener('DOMContentLoaded', init)
