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
let score = 0
let gameTimerId = null
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
      square.dataset.position = i
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

  function canGoDown(playerIndexes/*, square*/) {

    // if (playerIndexes) {
      for (let i = playerIndexes.length-1; i >= 0; i--) {
        const position = playerIndexes[i]
        if (!(position + width < width * height) || isOccupied(position+width)) {
          return false
        }
      }
    // } /else {
    //   const position = square.dataset.positions
    //   if (!(position + width < width * height) || isOccupied(position+width)) {
    //     return false
    //   }
    // }
    return true
  }

  function canRotate(currentPositions, rotatedPositions) {

    for (var i = 0; i < currentPositions.length; i++) {

      const before = squares[currentPositions[i]].dataset.column
      const after = squares[rotatedPositions[i]].dataset.column
      //console.log((before))
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
        if (canGoDown(playerIndexes)) {
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
      if (!canGoDown(playerIndexes)) {
        freezeCurrentShape()
        // generateNewShape()
      }
    },100)

    dropTimerId = setInterval(() => {
      savePreviousPosition(playerIndexes)
      if (canGoDown(playerIndexes)) {
        moveDown()
        updateGrid(previousIndexes)
      } else {
        generateNewShape()
      }
      //console.log(squares[182])
    }, 1000)

  }

  function moveRowsDown(row) {
    const occupiedSquares = document.querySelectorAll('.shape-inactive')
    console.log(occupiedSquares)
    //console.log(occupiedSquares)
    // occupiedSquares.forEach(square => {
    //
    //   const squareRow = square.dataset.row
    //   //console.log(squareRow)
    //   const position = parseInt(square.dataset.position)
    //   // console.log(`position is ${position}`)
    //   if (squareRow < row) {
    //     square.classList.remove('shape-inactive')
    //     // console.log(squares[position])
    //     // console.log(squares[(position+width)])
    //     squares[(position+width)].classList.add('shape-inactive')
    //   }
    // })
    for (let i = occupiedSquares.length-1; i >=0 ; i--) {
      const square = occupiedSquares[i]
      const squareRow = square.dataset.row
      const position = parseInt(square.dataset.position)
      if (squareRow < row) {
        square.classList.remove('shape-inactive')
        //console.log(squares[position])
        // console.log(squares[(position+width)])
        squares[(position+width)].classList.add('shape-inactive')
      }
    }

  }

  function checkCompletedRows() {
    //let completed = true
    const scoreSpan = document.querySelector('#score')
    let filledRows = ''

    checkRowsTimerId = setInterval(() => {
      filledRows = []
      //console.log(`filledRows when iniialised ${filledRows.length}`)
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
        //sconsole.log(squares[row[0]].dataset.row, count, row.length)
        //console.log(count)
        //console.log('inside forEach')
        if (count===row.length) {
          const filledRow = squares[row[0]].dataset.row

          for (let i = row[0]; i < row[0] + width; i++) {
            squares[i].classList.remove('shape-inactive')
            //console.log('full row')
          }
          filledRows.push(filledRow)
          score++
          scoreSpan.innerText = score
        }
      })
      //console.log(`filledRows at end ${filledRows.length}`)
      console.log(filledRows)
      if (filledRows.length > 0) {
        filledRows.forEach(row => moveRowsDown(row))
      }
      //console.log('outside forEach')
    }, 5000)
  }

  function startGameTimer() {
    const timeSpan = document.querySelector('#time')
    const gameStartTime = new Date()

    gameTimerId = setInterval(() => {
      const gameCurrentTime = new Date()
      let time = (gameCurrentTime - gameStartTime)
      time = Math.floor(time/1000)
      let minutes = Math.floor(time / 60)
      let seconds = time
      minutes < 1 ? minutes = 0 : seconds = time - (minutes*60)
      if (minutes<10) minutes = '0' + minutes
      if (seconds<10) seconds = '0' + seconds
      timeSpan.innerText = `${minutes}:${seconds}`
    }, 1000)
  }

  generateGrid()
  generateNewShape()
  // moveShape()
  dropShapes()
  checkCompletedRows()
  startGameTimer()
  const shape = document.querySelector('.shape')
  document.stylesheet.cssRules[0].style.backgroundColor = 'blue'
  console.log(shape.style.CSSStyleDeclaration)

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
