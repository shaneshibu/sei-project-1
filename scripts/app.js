const height = 20
const width = 10
const squares = []
let playerIndexes = []
const previousIndexes = []
let ghostIndexes = []
const rows = []
let dropTimerId = null
let canMoveCheckTimerId = null
let checkRowsTimerId = null
let checkLossId = null
let score = 0
let player1Name = ''
let gameTimerId = null
const shapeNames = ['I', 'O', 'T', 'J', 'L', 'S', 'Z']
const shapeQueue = []
let activeShape = null
const endMessage = 'Game Over'
let theme = null
let gameSpeed = 1000
const highScores = [
  {
    name: '',
    score: 0
  },
  {
    name: '',
    score: 0
  },
  {
    name: '',
    score: 0
  },
  {
    name: '',
    score: 0
  },
  {
    name: '',
    score: 0
  }
]

class Tetromino {
  constructor(name) {
    this.name = name
    this.initialPosition(name)
    this.setColor(name)
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
  setColor(name) {
    const colors = {
      I: 'turquoise',
      O: 'yellow',
      T: 'purple',
      J: 'blue',
      L: 'orange',
      S: 'green',
      Z: 'red'
    }
    this.color = colors[name]
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
  const grid1 = document.querySelector('#grid1')
  const thisCSS = document.styleSheets[0]
  const loadPage = document.querySelector('#load-page')
  const startButton = document.querySelector('#start-game-button')
  const player1Tile = document.querySelector('#player1')
  const message1 = document.querySelector('#gameboard1 p.message')
  const instructionsButton = document.querySelector('#instructions-button')
  const instructions = document.querySelector('#instructions')
  const highScoreButton = document.querySelector('#high-score-button')
  const highScoreDiv = document.querySelector('#high-scores')
  const highScoreResults = document.querySelectorAll('#high-scores > small')
  const shapeQueueDiv = document.querySelector('#shapequeue1')
  const scoreSpan1 = document.querySelector('#score1')
  const timeSpan1 = document.querySelector('#timespan1')
  const themeButtons = document.querySelectorAll('footer > p')
  const mute = document.querySelector('#mute')
  const play = document.querySelector('#play')
  const music = document.querySelector('audio')

  function generateGrid() {

    for (let i = 0; i < width * height; i++) {
      const square = document.createElement('div')
      square.classList.add('grid-item')
      square.dataset.position = i
      squares.push(square)
      grid1.append(square)
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

  function generateShapeQueue() {
    generateNewShape()
    generateNewShape()
    generateNewShape()
    generateNewShape()
    generateNewShape()
    generateNewShape()
  }

  function displayQueue() {

    for (var i = 0; i < shapeQueueDiv.children.length; i++) {
      const div = shapeQueueDiv.children[i]
      const name = shapeQueue[i].name
      div.style.backgroundImage = 'url("./assets/' + name + '.png")'
    }
  }

  function generateNewShape() {

    let newShape = new Tetromino(shapeNames[Math.floor(Math.random() * shapeNames.length)])

    // if 4 S or Z tetrominos created in a row, do not create another
    let count = 0
    if (shapeQueue.length >= 4) {
      for (var i = shapeQueue.length-1; i >= shapeQueue.length - 4; i--) {
        if (shapeQueue[i].name === 'S' || shapeQueue[i].name === 'Z') {
          count++
        }
      }
      if (count === 4) {
        while (newShape.name === 'S' || newShape.name === 'Z') {
          newShape = new Tetromino(shapeNames[Math.floor(Math.random() * shapeNames.length)])
        }
      }
    }

    shapeQueue.push(newShape)

  }

  function selectNextShape() {
    activeShape = shapeQueue.shift()
    playerIndexes = []
    activeShape.positions.forEach(position => playerIndexes.push(position))
    for (let i = 0; i < playerIndexes.length; i++) {
      squares[playerIndexes[i]].classList.add('shape')
    }
    for (let i = 0; i < thisCSS.cssRules.length; i++) {
      if (thisCSS.cssRules[i].selectorText === '.shape' || thisCSS.cssRules[i].selectorText === '.shape-ghost') {
        thisCSS.cssRules[i].style['backgroundColor'] = activeShape.color
      }
    }
  }

  function displayGhost() {
    ghostIndexes = []
    for (let i = 0; i < playerIndexes.length; i++) {
      ghostIndexes.push(playerIndexes[i])
    }

    while (canGoDown(ghostIndexes)) {
      for (let i = 0; i < ghostIndexes.length; i++) {
        ghostIndexes[i] += width
      }
    }
    for (let i = 0; i < ghostIndexes.length; i++) {
      squares[ghostIndexes[i]].classList.add('shape-ghost')
    }
  }

  function freezeCurrentShape() {

    for (let i = 0; i < playerIndexes.length; i++) {
      squares[playerIndexes[i]].classList.replace('shape', 'shape-inactive')
    }
  }

  function isOccupied(num) {
    return squares[num].classList.contains('shape-inactive')
  }

  function canGoLeft() {
    for (let i = 0; i < playerIndexes.length; i++) {
      const position = playerIndexes[i]
      if (!(position % width > 0) || isOccupied(position-1)) {
        return false
      }
    }
    return true
  }

  function canGoRight() {
    for (let i = 0; i < playerIndexes.length; i++) {
      const position = playerIndexes[i]
      if (!(position % width < width - 1) || isOccupied(position+1)) {
        return false
      }
    }
    return true
    // return playerIndexes[0] % width < width - 1 ? true : false
  }

  function canGoDown(playerIndexes) {

    for (let i = playerIndexes.length-1; i >= 0; i--) {
      const position = playerIndexes[i]
      if (!(position + width < width * height) || isOccupied(position+width)) {
        return false
      }
    }
    return true
  }

  function canGoUp() {
    for (let i = playerIndexes.length-1; i >= 0; i--) {
      const position = playerIndexes[i]
      if (position - width < 0) {
        return false
      }
    }
    return true
  }

  function canRotate(currentPositions, rotatedPositions) {

    for (var i = 0; i < currentPositions.length; i++) {

      const before = squares[currentPositions[i]].dataset.column
      const after = squares[rotatedPositions[i]].dataset.column
      const afterRow = squares[rotatedPositions[i]].dataset.row

      if ((before<3 && after>6) || (before>6 && after<3) || (afterRow<0)) {
        return false
      }
    }
    return true
  }

  function reachedTop() {
    if (!canGoDown(playerIndexes) && !canGoUp()) {
      return true
    }
    return false
  }

  function moveDown() {
    for (let i = 0; i < playerIndexes.length; i++) {
      playerIndexes[i] += width
    }
  }

  function updateGrid(indexes) {
    indexes.forEach(index => squares[index])
    for (let i = 0; i < indexes.length; i++) {
      squares[indexes[i]].classList.remove('shape')
    }
    squares.forEach(square => square.classList.remove('shape-ghost'))

    playerIndexes.forEach(index => squares[index].classList.add('shape'))
    displayGhost()
  }

  function handleKeyDown(e) {
    let rotatedPositions = null
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
        break
      case 'ArrowUp':
        if (activeShape.name !== 'O') {
          rotatedPositions = activeShape.rotate(playerIndexes).slice()
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
        }
        break
      default:
        gridShouldUpdate = false
    }
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
        generateNewShape()
        selectNextShape()
        displayQueue()
      }
    },200)

    dropTimerId = setInterval(() => {
      savePreviousPosition(playerIndexes)
      if (canGoDown(playerIndexes)) {
        moveDown()
        updateGrid(previousIndexes)
      } else {
        //generateNewShape()
      }
      //console.log(squares[182])
    }, gameSpeed)

  }

  function stopDropShapes() {
    clearInterval(canMoveCheckTimerId)
    clearInterval(dropTimerId)
  }

  function moveRowsDown(row) {
    const occupiedSquares = document.querySelectorAll('.shape-inactive')
    for (let i = occupiedSquares.length-1; i >=0 ; i--) {
      const occupiedSquare = occupiedSquares[i]
      const occupiedSquareRow = occupiedSquare.dataset.row
      const position = parseInt(occupiedSquare.dataset.position)
      if (occupiedSquareRow < row) {
        occupiedSquare.classList.remove('shape-inactive')
        squares[(position+width)].classList.add('shape-inactive')
      }
    }

  }

  function checkCompletedRows() {

    let filledRows = ''
    checkRowsTimerId = setInterval(() => {
      filledRows = []

      rows.forEach(row => {
        let count = 0
        for (let i = row[0]; i < row[0] + width; i++) {
          if (squares[i].classList.contains('shape-inactive')) {
            count++
          }
        }
        if (count===row.length) {
          const filledRow = squares[row[0]].dataset.row

          for (let i = row[0]; i < row[0] + width; i++) {
            squares[i].classList.remove('shape-inactive')
          }
          filledRows.push(filledRow)
          score += Math.floor(Math.pow(10,filledRows.length))
          scoreSpan1.innerText = score
        }
      })
      if (filledRows.length > 0) {
        filledRows.forEach(row => moveRowsDown(row))
        if (gameSpeed > 200) gameSpeed -= filledRows.length * 50
        stopDropShapes()
        dropShapes()
      }
    }, 200)
  }

  function stopCheckingRows() {
    clearInterval(checkRowsTimerId)
  }

  function startGameTimer() {

    const gameStartTime = new Date()
    let time = 0
    gameTimerId = setInterval(() => {
      const gameCurrentTime = new Date()
      time = (gameCurrentTime - gameStartTime)
      time = Math.floor(time/1000)
      let minutes = Math.floor(time / 60)
      let seconds = time
      minutes < 1 ? minutes = 0 : seconds = time - (minutes*60)
      if (minutes<10) minutes = '0' + minutes
      if (seconds<10) seconds = '0' + seconds
      timeSpan1.innerText = `${minutes}:${seconds}`
    }, 1000)

  }

  function stopGameTimer() {
    clearInterval(gameTimerId)
  }

  function checkLoss() {
    checkLossId = setInterval(() => {
      if (reachedTop()) {
        gameEnd()
      }
    },100)
  }

  function stopCheckLoss() {
    clearInterval(checkLossId)
  }

  function gameStart() {
    toggleVisibility(loadPage)
    toggleVisibility(player1Tile)
    generateGrid()
    getPlayerName()
    generateShapeQueue()
    selectNextShape()
    displayQueue()
    window.addEventListener('keydown', handleKeyDown)
    dropShapes()
    checkCompletedRows()
    startGameTimer()
    checkLoss()
  }

  function gameEnd() {
    stopGameTimer()

    stopDropShapes()
    displayMessage()
    stopCheckLoss()
    stopCheckingRows()
    window.addEventListener('click', goBackToLoadPage)
    window.removeEventListener('keydown', handleKeyDown)
  }

  function getPlayerName() {
    player1Name = window.prompt('Enter Your Name', 'Player 1')
  }

  function displayMessage() {
    console.log('you lost')
    let highScoreMessage = ''
    if (checkIfHighScore()) highScoreMessage = '\nNew High Score!\n' + score
    message1.innerText = endMessage + highScoreMessage
    toggleVisibility(message1)
  }

  function checkIfHighScore() {
    for (var i = 0; i < highScores.length; i++) {
      if (score > highScores[i]['score']) {
        updateHighScore()
        return true
      }
    }
    return false
  }

  function updateHighScore() {
    highScores.pop()
    highScores.push({name: player1Name, score: score})
    sortHighScores()
    saveHighScores()
    displayHighScores()

  }

  function sortHighScores() {
    highScores.sort((a,b) => {
      if (a.score > b.score) return -1
      if (a.score < b.score) return 1
      if (a.name.toLowerCase() < b.name.toLowerCase()) return 0
    })
  }

  function displayHighScores() {
    for (var i = 0; i < highScores.length; i++) {
      const playerName = highScores[i].name
      const playerScore = highScores[i].score
      highScoreResults[i].innerText = `${playerName} : ${playerScore}`
      console.log(playerName, playerScore, highScoreResults[i])
    }
  }

  function saveHighScores() {
    for (var i = 1; i <= highScores.length; i++) {
      localStorage.setItem(`player${i}Name`, highScores[i-1].name)
      localStorage.setItem(`player${i}Score`, highScores[i-1].score)
    }
  }

  function loadHighScores() {
    if (localStorage.length > 0) {
      for (let i = 1; i <= highScores.length; i++) {
        highScores[i-1].name = localStorage.getItem(`player${i}Name`)
        highScores[i-1].score = localStorage.getItem(`player${i}Score`)
      }
    } else {
      for (let i = 1; i <= highScores.length; i++) {
        localStorage.setItem(`player${i}Name`, `Player ${i}`)
        localStorage.setItem(`player${i}Score`, 0)
        highScores[i] = {name: `Player ${i}`, score: 0}
      }
    }

  }

  function resetGrid() {
    squares.forEach(square => {
      square.classList.remove('shape')
      square.classList.remove('shape-ghost')
      square.classList.remove('shape-inactive')
    })
  }

  function goBackToLoadPage() {
    toggleVisibility(player1Tile)
    toggleVisibility(loadPage)
    resetGrid()
    window.removeEventListener('click', goBackToLoadPage)
  }

  function toggleVisibility(element) {
    for (var i = 0; i < thisCSS.cssRules.length; i++) {
      if (thisCSS.cssRules[i].selectorText===`#${element.id}`) {
        if (thisCSS.cssRules[i].style['display'] === 'none') {
          thisCSS.cssRules[i].style['display'] = 'flex'
        } else {
          thisCSS.cssRules[i].style['display'] = 'none'
        }
      }
    }
  }

  function changeTheme(theme) {
    if (theme === 'classic') {

      for (let i = 0; i < thisCSS.cssRules.length; i++) {
        if (thisCSS.cssRules[i].selectorText === 'body') {
          thisCSS.cssRules[i].style['background'] = 'linear-gradient(270deg, #40e0d0, #0000ff, #ffa500, #ffff00, #008000, #800080, #ff0000)'
          thisCSS.cssRules[i].style['color'] = 'black'
        }
        if (thisCSS.cssRules[i].selectorText === '#load-page p') {
          thisCSS.cssRules[i].style['border'] = '1px solid black'
        }
        if (thisCSS.cssRules[i].selectorText === '.grid') {
          thisCSS.cssRules[i].style['border'] = '0.5px solid black'
          thisCSS.cssRules[i].style['box-shadow'] = 'none'
        }
        if (thisCSS.cssRules[i].selectorText === '.grid-item') {
          thisCSS.cssRules[i].style['border'] = '1px solid rgba(0, 0, 0, 0.1)'
        }
        if (thisCSS.cssRules[i].selectorText === '.shape') {
          thisCSS.cssRules[i].style['border'] = '1px solid black'
          thisCSS.cssRules[i].style['box-shadow'] = 'none'
        }
        if (thisCSS.cssRules[i].selectorText === '.shape-ghost') {
          thisCSS.cssRules[i].style['border'] = '1px solid black'
        }
        if (thisCSS.cssRules[i].selectorText === '.shape-inactive') {
          thisCSS.cssRules[i].style['background'] = 'rgba(0, 0, 0, 0.3)'
        }
      }

    } else {

      for (let i = 0; i < thisCSS.cssRules.length; i++) {
        if (thisCSS.cssRules[i].selectorText === 'body') {
          thisCSS.cssRules[i].style['background'] = '#111'
          thisCSS.cssRules[i].style['color'] = 'rgba(0,168,255,1)'
        }
        if (thisCSS.cssRules[i].selectorText === '#load-page p') {
          thisCSS.cssRules[i].style['border'] = '1px solid rgba(0,168,255,0.75)'
        }
        if (thisCSS.cssRules[i].selectorText === '.grid') {
          thisCSS.cssRules[i].style['border'] = '0.5px solid white'
          thisCSS.cssRules[i].style['box-shadow'] = '0px 0px 10px 2px rgba(0,168,255,0.75)'
        }
        if (thisCSS.cssRules[i].selectorText === '.grid-item') {
          thisCSS.cssRules[i].style['border'] = '1px solid rgba(255, 255, 255, 0.9)'
        }
        if (thisCSS.cssRules[i].selectorText === '.shape') {
          thisCSS.cssRules[i].style['border'] = '1px solid white'
          thisCSS.cssRules[i].style['box-shadow'] = '0px 0px 10px 2px rgba(0,168,255,0.75)'
        }
        if (thisCSS.cssRules[i].selectorText === '.shape-ghost') {
          thisCSS.cssRules[i].style['border'] = '1px solid white'
        }
        if (thisCSS.cssRules[i].selectorText === '.shape-inactive') {
          thisCSS.cssRules[i].style['background'] = 'rgba(255, 255, 255, 0.3)'
        }
      }
    }
  }

  function loadGame() {
    loadHighScores()
    displayHighScores()

    startButton.addEventListener('click', gameStart)

    instructionsButton.addEventListener('click', () => {
      toggleVisibility(instructions)
    })

    highScoreButton.addEventListener('click', () => {
      toggleVisibility(highScoreDiv)
    })

    themeButtons.forEach(button => {
      button.addEventListener('click', () => {
        theme = button.classList[0]
        changeTheme(theme)
      })
    })

    mute.addEventListener('click', () => {
      mute.style.display = 'none'
      play.style.display = 'inline'
      music.pause()
    })

    play.addEventListener('click', () => {
      mute.style.display = 'inline'
      play.style.display = 'none'
      music.play()
    })

  }

  loadGame()

}

window.addEventListener('DOMContentLoaded', init)
