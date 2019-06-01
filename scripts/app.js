const height = 20
const width = 10
const squares = []
let playerIndexes = []
let previousIndexes = []
let dropTimerId = null
let canMoveCheckTimerId = null
const colors = ['red', 'green', 'blue', 'yellow']
let activeShape = null

class Tetromino {
  constructor() {
    this.name = 'I'
    this.positions = [0,1,2,11]
    this.pos1 = this.positions[0]
    this.pos2 = this.positions[1]
    this.pos3 = this.positions[2]
    this.pos4 = this.positions[3]
    this.orientation = 0
  }
  rotate(indexes) {
    const pos1 = indexes[0]
    const pos2 = indexes[1]
    const pos3 = indexes[2]
    const pos4 = indexes[3]
    if (this.orientation === 0) {
      this.positions = [pos1+1-width, pos2, pos3-1+width, pos4-1-width]
      this.orientation = 90
    }
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
    activeShape = new Tetromino()
    // const color = colors[Math.floor(Math.random() * 4)]
    playerIndexes = []
    activeShape.positions.forEach(index => playerIndexes.push(index))
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
  }


  function handleKeyDown(e) {

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
        console.log(activeShape.rotate(playerIndexes))
        playerIndexes = activeShape.rotate(playerIndexes)
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
    },1000)

    dropTimerId = setInterval(() => {
      savePreviousPosition(playerIndexes)
      moveDown()
      updateGrid(previousIndexes)
    }, 1000)

  }

  generateGrid()
  generateNewShape()
  // moveShape()
  dropShapes()


  window.addEventListener('keydown', handleKeyDown)
}

window.addEventListener('DOMContentLoaded', init)
