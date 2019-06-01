const height = 20
const width = 10
const squares = []
let playerIndexes = [0,1,2,11]
let previousIndexes = [300,300,300,300]
let timerId = null
const colors = ['red', 'green', 'blue', 'yellow']

function init() {

  const grid = document.querySelector('#grid')

  function generateGrid() {

    for (var i = 0; i < width * height; i++) {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      squares.push(square)
      grid.append(square)
    }

  }

  function generateShape() {
    // const color = colors[Math.floor(Math.random() * 4)]
    playerIndexes = [0,1,2,11]
    for (var i = 0; i < playerIndexes.length; i++) {
      squares[playerIndexes[i]].classList.add('shape')

      // squares[playerIndexes[i]].classList.add(color)
      // console.log(squares)
    }

  }

  function canGoLeft() {
    // playerIndexes.forEach((index) => {
    //   if (!(index % width > 0)) {
    //     return false
    //   }
    // })
    for (var i = 0; i < playerIndexes.length; i++) {
      if (!(playerIndexes[i] % width > 0)) {
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
      if (!(playerIndexes[i] % width < width - 1)) {
        return false
      }
    }
    return true
    // return playerIndexes[0] % width < width - 1 ? true : false
  }

  function canGoDown() {
    for (var i = 0; i < playerIndexes.length; i++) {
      if (!(playerIndexes[i] + width < width * height)) {
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

  function moveShape(indexes) {
    updateGrid(indexes)
    // for (var i = 0; i < playerIndex.length; i++) {
    //   playerIndex[i]
    // }
    playerIndexes.forEach((index) => squares[index].classList.add('shape'))
    // squares[playerIndex[i]].forEach(square => square.classList.add('shape'))

  }

  function updateGrid(indexes) {
    // squares.forEach(square => square.classList.remove('shape'))
    //indexes.forEach(index => squares[index])
    for (var i = 0; i < indexes.length; i++) {
      squares[indexes[i]].classList.remove('shape')
      console.log(squares[indexes[i]])
    }
  }


  function handleKeyDown(e) {

    console.log(e.keyCode)
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
    console.log(previousIndexes)
    console.log(playerIndexes)
    if (playerShouldMove) moveShape(previousIndexes)
  }

  function savePreviousPosition(indexes) {
    for (var i = 0; i < indexes.length; i++) {
      previousIndexes[i] = indexes[i]
    }
  }

  function dropShapes() {

    timerId = setInterval(() => {
      if (canGoDown()) {
        // previousIndexes = playerIndexes
        savePreviousPosition(playerIndexes)
        console.log(`previous ${previousIndexes}`)
        console.log(`current ${playerIndexes}`)
        moveDown()
        console.log(`previous ${previousIndexes}`)
        console.log(`current ${playerIndexes}`)
        moveShape(previousIndexes)
      } else {
        generateShape()
      }
    }, 1000)

  }

  generateGrid()
  generateShape()
  // moveShape()
  dropShapes()


  window.addEventListener('keydown', handleKeyDown)
}

window.addEventListener('DOMContentLoaded', init)
