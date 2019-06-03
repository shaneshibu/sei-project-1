const height = 20
const width = 10
const squares = []
let playerIndexes = []
let previousIndexes = []
let rows = []
let dropTimerId = null
let canMoveCheckTimerId = null
let checkRowsTimerId = null
let keyDelayId = null
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
      S: [6, 5, 15, 14],
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
        0: [pos3 - width, pos3, pos3 + width, pos3 + (2 * width)],
        90: [pos3 - 2, pos3 - 1, pos3, pos3 + 1],
        180: [pos2 - (2 * width), pos2 - width, pos2, pos2 + width],
        270: [pos2 - 1, pos2, pos2 + 1, pos2 + 2]
      },
      T: {
        0: [pos4, pos1, pos3, pos3 + width],
        90: [pos4, pos1, pos3, pos3 - 1],
        180: [pos4, pos1, pos3, pos3 - width],
        270: [pos4, pos1, pos3, pos3 + 1]
      },
      J: {
        0: [pos3 - width + 1, pos3 - width, pos3, pos3 + width],
        90: [pos3 + 1 + width, pos3 + 1, pos3, pos3 - 1],
        180: [pos3 + width - 1, pos3 + width, pos3, pos3 - width],
        270: [pos3 - 1 - width, pos3 - 1, pos3, pos3 + 1]
      },
      L: {
        0: [pos3 + width + 1, pos3 + width, pos3, pos3 - width],
        90: [pos3 - 1 + width, pos3 - 1, pos3, pos3 + 1],
        180: [pos3 - width - 1, pos3 - width, pos3, pos3 + width],
        270: [pos3 + 1 - width, pos3 + 1, pos3, pos3 - 1]
      },
      S: {
        0: [pos3 + 1 + width, pos3 + 1, pos3, pos3 - width],
        90: [pos3 + width - 1, pos3 + width, pos3, pos3 + 1],
        180: [pos3 - 1 - width, pos3 - 1, pos3, pos3 + width],
        270: [pos3 - width + 1, pos3 - width, pos3, pos3 - 1]
      },
      Z: {
        0: [pos3 + 1 - width, pos3 + 1, pos3, pos3 + width],
        90: [pos3 + width + 1, pos3 + width, pos3, pos3 - 1],
        180: [pos3 - 1 + width, pos3 - 1, pos3, pos3 - width],
        270: [pos3 - width - 1, pos3 - width, pos3, pos3 + 1]
      }
    }
    // console.log('hello' + this.positions)
    //this.positions = []
    this.positions[0] = rotatedPositions[this.name][this.orientation][0]
    this.positions[1] = rotatedPositions[this.name][this.orientation][1]
    this.positions[2] = rotatedPositions[this.name][this.orientation][2]
    this.positions[3] = rotatedPositions[this.name][this.orientation][3]
    // console.log(this.orientation)
    this.orientation !== 270 ? this.orientation += 90 : this.orientation = 0
    // console.log(this.orientation)
    return this.positions
  }
}


function init() {
  // console.log()
  const grid = document.querySelector('#grid')

  function generateGrid() {

    for (let i = 0; i < width * height; i++) {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.append(square)
    }

    // fill rows array
    for (let i = 0; i < height; i++) {
      rows[i] = []
      for (let j = 0; j < width; j++) {
        rows[i].push( (i*width) + j )
        //console.log(rows[i])
        squares[(i*width) + j].dataset.row = i
        squares[(i*width) + j].dataset.column = j
      }
    }
  }

  function generateNewShape() {

    activeShape = new Tetromino(shapeNames[Math.floor(Math.random() * shapeNames.length)])
    // const color = colors[Math.floor(Math.random() * 4)]
    playerIndexes = []
    activeShape.positions.forEach(position => playerIndexes.push(position))
    for (let i = 0; i < playerIndexes.length; i++) {
      squares[playerIndexes[i]].classList.add('shape')
      // squares[playerIndexes[i]].classList.add(color)
      // console.log(squares)
    }
  }

  function freezeCurrentShape() {

    for (let i = 0; i < playerIndexes.length; i++) {
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
    for (let i = 0; i < playerIndexes.length; i++) {
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
    for (let i = 0; i < playerIndexes.length; i++) {
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
    for (let i = 0; i < playerIndexes.length; i++) {
      const position = playerIndexes[i]
      if (!(position + width < width * height) || isOccupied(position+width)) {
        return false
      }
    }
    return true
  }

  function canRotate(currentPositions, rotatedPositions) {

    for (var i = 0; i < currentPositions.length; i++) {

      const before = squares[currentPositions[i]].dataset.column
      const after = squares[rotatedPositions[i]].dataset.column
      console.log((before))
      if ((before<3 && after>6) || (before>6 && after<3)) {
        return false
      }
    }
    return true
  }

  function moveDown() {
    for (let i = 0; i < playerIndexes.length; i++) {
      playerIndexes[i] += width
    }
  }

  function updateGrid(indexes) {
    // squares.forEach(square => square.classList.remove('shape'))
    //indexes.forEach(index => squares[index])
    for (let i = 0; i < indexes.length; i++) {
      squares[indexes[i]].classList.remove('shape')
      // console.log(squares[indexes[i]])
    }

    playerIndexes.forEach(index => squares[index].classList.add('shape'))
    //console.log('updating grid ' + indexes)
  }


  function handleKeyDown(e) {
    let rotatedPositions = null
    // console.log(e.key)
    savePreviousPosition(playerIndexes)
    let gridShouldUpdate = true

    switch (e.key) {
      case 'ArrowLeft':
        if (canGoLeft()) {
          for (let i = 0; i < playerIndexes.length; i++) {
            playerIndexes[i]--
          }
          // console.log(canGoLeft())
        }
        break
      case 'ArrowRight':
        if (canGoRight()) {
          for (let i = 0; i < playerIndexes.length; i++) {
            playerIndexes[i]++
          }
        }
        // console.log(canGoRight())
        break
      case 'ArrowUp':
        if (activeShape.name !== 'O') {
          rotatedPositions = activeShape.rotate(playerIndexes).slice()
          //console.log(canRotate(playerIndexes, rotatedPositions))
          if (canRotate(playerIndexes, rotatedPositions)) {
            playerIndexes = []
            rotatedPositions.forEach(position => playerIndexes.push(position))
          }
        } else {
          gridShouldUpdate = false
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
        gridShouldUpdate = false
    }
    // console.log(previousIndexes)
    // console.log(playerIndexes)
    if (gridShouldUpdate) updateGrid(previousIndexes)
  }

  function savePreviousPosition(indexes) {
    for (let i = 0; i < indexes.length; i++) {
      previousIndexes[i] = indexes[i]
    }
  }

  function dropShapes() {

    canMoveCheckTimerId = setInterval(() => {
      if (!canGoDown()) {
        freezeCurrentShape()
        // generateNewShape()
      }
    },100)

    dropTimerId = setInterval(() => {
      savePreviousPosition(playerIndexes)
      if (canGoDown()) {
        moveDown()
        updateGrid(previousIndexes)
      } else {
        generateNewShape()
      }
    }, 1000)

  }

  function checkCompletedRows() {
    let completed = true

    checkRowsTimerId = setInterval(() => {
      rows.forEach(row => {
        let count = 0
        for (let i = row[0]; i < row[0] + width; i++) {
          //console.log(squares[i])
          if (squares[i].classList.contains('shape-inactive')) {
            count++
          }

          //console.log(squares[i])
          //console.log('inside for')
        }
        //console.log(squares[row[0]].dataset.row)
        //console.log(count)
        //console.log('inside forEach')
        if (count===row.length) {
          for (var i = 0; i < row.length; i++) {
            squares[i].classList.add('new-class')
            console.log('full row')
          }
        }
      })

      //console.log('outside forEach')
    }, 2000)
  }

  generateGrid()
  generateNewShape()
  // moveShape()
  dropShapes()
  checkCompletedRows()

  // window.addEventListener('keydown', (e) => {
  //   let keyDelayTime = null
  //
  //   //console.log(e.repeat)
  //   e.repeat ? keyDelayTime = 500 : keyDelayTime = 0
  //   keyDelayId = setTimeout(() => {
  //     handleKeyDown(e)
  //     console.log(keyDelayTime)
  //     return
  //   }, keyDelayTime)
  //   // handleKeyDown(e)
  // })
  // window.addEventListener('keyup', () => {
  //   clearTimeout(keyDelayId)
  // })
  window.addEventListener('keydown', handleKeyDown)
}

window.addEventListener('DOMContentLoaded', init)
