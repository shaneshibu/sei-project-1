const height = 20
const width = 10
const squares = {
  1: [],
  2: []
}
const playerIndexes = {
  1: [],
  2: []
}
const ghostIndexes = {
  1: [],
  2: []
}
const rows = {
  1: [],
  2: []
}
const dropTimerId = {
  1: null,
  2: null
}
const canMoveCheckTimerId = {
  1: null,
  2: null
}
const checkRowsTimerId = {
  1: null,
  2: null
}
// let keyDelayId = null
const checkLossId = {
  1: null,
  2: null
}
const gridUpdateTimerId = {
  1: null,
  2: null
}
const score = {
  1: 0,
  2: 0
}
const playerName = {
  1: '',
  2: ''
}
const gameTimerId = {
  1: null,
  2: null
}
const shapeNames = ['I', 'O', 'T', 'J', 'L', 'S', 'Z']
const shapeQueue = {
  1: [],
  2: []
}
let activeShape = null
const displayMessages = ['You Win!', 'You Lose', 'Game Over']
let theme = null
const gameSpeed = {
  1: 1000,
  2: 1000
}
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
const grids = {
  1: null,
  2: null
}
const shapeQueues = {
  1: null,
  2: null
}
const scoreSpans = {
  1: null,
  2: null
}
const timeSpans = {
  1: null,
  2: null
}
const message = {
  1: null,
  2: null
}

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

  grids[1] = document.querySelector('#grid1')
  grids[2] = document.querySelector('#grid2')
  shapeQueues[1] = document.querySelector('#shapequeue1')
  shapeQueues[2] = document.querySelector('#shapequeue2')
  const thisCSS = document.styleSheets[0]
  const loadPage = document.querySelector('#load-page')
  const startButton = document.querySelector('#start-game-button')
  const startGameDiv = document.querySelectorAll('#start-game > small')
  const start1Player = document.querySelector('#start1Player')
  const start2Player = document.querySelector('#start2Player')
  const player1Tile = document.querySelector('#player1')
  const player2Tile = document.querySelector('#player2')
  message[1] = document.querySelector('#message1')
  message[2] = document.querySelector('#message2')
  const instructionsButton = document.querySelector('#instructions-button')
  const instructions = document.querySelector('#instructions')
  const highScoreButton = document.querySelector('#high-score-button')
  const highScoreDiv = document.querySelector('#high-scores')
  const highScoreResults = document.querySelectorAll('#high-scores > small')
  const themeButtons = document.querySelectorAll('footer > p')
  scoreSpans[1] = document.querySelector('#score1')
  scoreSpans[2] = document.querySelector('#score2')
  timeSpans[1] = document.querySelector('#timespan1')
  timeSpans[2] = document.querySelector('#timespan2')
  const mute = document.querySelector('#mute')
  const play = document.querySelector('#play')
  const music = document.querySelector('audio')


  function generateGrid(players) {

    for (let i = 1; i <= players; i++) {
      for (let j = 0; j < width * height; j++) {
        const square = document.createElement('div')
        square.classList.add('grid-item')
        square.dataset.position = j
        squares[i].push(square)
        grids[i].append(square)
      }
    }

    // fill rows array
    for (let i = 1; i <= players; i++) {
      for (let j = 0; j < height; j++) {
        rows[i][j] = []
        for (let k = 0; k < width; k++) {
          rows[i][j].push( (j*width) + k )
          squares[i][(j*width) + k].dataset.row = j
          squares[i][(j*width) + k].dataset.column = k
        }
      }
    }

  }

  function generateShapeQueue(players) {
    for (var i = 1; i <= players; i++) {
      generateNewShape(i)
      generateNewShape(i)
      generateNewShape(i)
      generateNewShape(i)
      generateNewShape(i)
      generateNewShape(i)
    }
  }

  function displayQueue(player) {
    const s = shapeQueues[player]

    for (var i = 0; i < s.children.length; i++) {
      const div = s.children[i]
      const name = shapeQueue[player][i].name
      div.style.backgroundImage = 'url("./assets/' + name + '.png")'
    }
  }

  function generateNewShape(player) {

    let newShape = new Tetromino(shapeNames[Math.floor(Math.random() * shapeNames.length)])

    // if 4 S or Z tetrominos created in a row, do not create another
    let count = 0
    if (shapeQueue[player].length >= 4) {
      for (var i = shapeQueue[player].length-1; i >= shapeQueue[player].length - 4; i--) {

        if (shapeQueue[player][i].name === 'S' || shapeQueue[player][i].name === 'Z') {
          count++
        }
      }
      if (count === 4) {
        while (newShape.name === 'S' || newShape.name === 'Z') {
          newShape = new Tetromino(shapeNames[Math.floor(Math.random() * shapeNames.length)])
        }
      }
    }


    shapeQueue[player].push(newShape)

  }

  function selectNextShape(player) {
    activeShape = shapeQueue[player].shift()
    playerIndexes[player] = []
    activeShape.positions.forEach(position => playerIndexes[player].push(position))
    for (let i = 0; i < playerIndexes[player].length; i++) {
      squares[player][playerIndexes[player][i]].classList.add('shape')
    }
    for (let i = 0; i < thisCSS.cssRules.length; i++) {
      if (thisCSS.cssRules[i].selectorText === '.shape' || thisCSS.cssRules[i].selectorText === '.shape-ghost') {
        thisCSS.cssRules[i].style['backgroundColor'] = activeShape.color
      }
    }
  }

  function displayGhost(player) {
    ghostIndexes[player] = []
    for (let i = 0; i < playerIndexes[player].length; i++) {
      ghostIndexes[player].push(playerIndexes[player][i])
    }

    while (canGoDown(ghostIndexes, player)) {
      for (let i = 0; i < ghostIndexes[player].length; i++) {
        ghostIndexes[player][i] += width
      }
    }
    for (let i = 0; i < ghostIndexes[player].length; i++) {
      squares[player][ghostIndexes[player][i]].classList.add('shape-ghost')
    }
  }

  function freezeCurrentShape(player) {

    for (let i = 0; i < playerIndexes[player].length; i++) {
      squares[player][playerIndexes[player][i]].classList.replace('shape', 'shape-inactive')
    }
  }

  function isOccupied(player, num) {
    return squares[player][num].classList.contains('shape-inactive')
  }

  function canGoLeft(player) {

    for (let i = 0; i < playerIndexes[player].length; i++) {
      const position = playerIndexes[player][i]
      if (!(position % width > 0) || isOccupied(player, position-1)) {
        return false
      }
    }
    return true
  }

  function canGoRight(player) {

    for (let i = 0; i < playerIndexes[player].length; i++) {
      const position = playerIndexes[player][i]
      if (!(position % width < width - 1) || isOccupied(player, position+1)) {
        return false
      }
    }
    return true
  }

  function canGoDown(playerIndexes, player) {

    for (let i = playerIndexes[player].length-1; i >= 0; i--) {
      const position = playerIndexes[player][i]
      if (!(position + width < width * height) || isOccupied(player, position+width)) {
        return false
      }
    }
    return true
  }

  function canGoUp(player) {
    for (let i = playerIndexes[player].length-1; i >= 0; i--) {
      const position = playerIndexes[player][i]
      if (position - width < 0) {
        //console.log('cant go up')
        return false
      }
    }
    return true
  }

  function canRotate(currentPositions, rotatedPositions, player) {

    for (var i = 0; i < currentPositions.length; i++) {

      const before = squares[player][currentPositions[i]].dataset.column
      const after = squares[player][rotatedPositions[i]].dataset.column
      const afterRow = squares[player][rotatedPositions[i]].dataset.row

      if ((before<3 && after>6) || (before>6 && after<3) || (afterRow<0)) {
        return false
      }
    }
    return true
  }

  function reachedTop(player) {
    if (!canGoDown(playerIndexes, player) && !canGoUp(player)) {
      return true
    }
    return false
  }

  function moveDown(player) {
    for (let i = 0; i < playerIndexes[player].length; i++) {
      playerIndexes[player][i] += width
    }
  }

  function updateGrid(player) {

    squares[player].forEach(square => square.classList.remove('shape-ghost'))
    squares[player].forEach(square => square.classList.remove('shape'))
    playerIndexes[player].forEach(index => squares[player][index].classList.add('shape'))
    displayGhost(player)
  }

  function handleKeyDown(e, players) {
    let rotatedPositions1 = null
    let rotatedPositions2 = null
    let grid1ShouldUpdate = true
    let grid2ShouldUpdate = false
    if (players === 2) grid2ShouldUpdate = true

    switch (e.key) {
      case 'ArrowLeft':
        if (canGoLeft(1)) {
          for (let i = 0; i < playerIndexes[1].length; i++) {
            playerIndexes[1][i]--
          }
        }
        break
      case 'ArrowRight':
        if (canGoRight(1)) {
          for (let i = 0; i < playerIndexes[1].length; i++) {
            playerIndexes[1][i]++
          }
        }
        break
      case 'ArrowUp':
        if (activeShape.name !== 'O') {
          rotatedPositions1 = activeShape.rotate(playerIndexes[1]).slice()
          //console.log(canRotate(playerIndexes, rotatedPositions))
          if (canRotate(playerIndexes[1], rotatedPositions1, 1)) {
            playerIndexes[1] = []
            rotatedPositions1.forEach(position => playerIndexes[1].push(position))
          }
        } else {
          grid1ShouldUpdate = false
        }
        break
      case 'ArrowDown':
        if (canGoDown(playerIndexes[1], 1)) {
          moveDown(1)
        }
        break
      case 'A':
      case 'a':
        if ((players === 2) && canGoLeft(2)) {
          for (let i = 0; i < playerIndexes[2].length; i++) {
            playerIndexes[2][i]--
          }
        }
        break
      case 'D':
      case 'd':
        if ((players === 2) && canGoRight(2)) {
          for (let i = 0; i < playerIndexes[2].length; i++) {
            playerIndexes[2][i]++
          }
        }
        break
      case 'W':
      case 'w':
        if ((players === 2) && activeShape.name !== 'O') {
          rotatedPositions2 = activeShape.rotate(playerIndexes[2]).slice()
          if (canRotate(playerIndexes[2], rotatedPositions2, 2)) {
            playerIndexes[2] = []
            rotatedPositions2.forEach(position => playerIndexes[2].push(position))
          }
        } else {
          grid2ShouldUpdate = false
        }
        break
      case 'S':
      case 's':
        if ((players === 2) && canGoDown(playerIndexes[2], 2)) {
          moveDown(2)
        }
        break
      default:
        //console.log('was not arrow')
        grid1ShouldUpdate = false
        grid2ShouldUpdate = false
    }
    if (grid1ShouldUpdate) updateGrid(1)
    if (grid2ShouldUpdate) updateGrid(2)
  }

  function dropShapes(player) {

    canMoveCheckTimerId[player] = setInterval(() => {
      if (!canGoDown(playerIndexes, player)) {
        freezeCurrentShape(player)
        generateNewShape(player)
        selectNextShape(player)
        displayQueue(player)
      }
    },100)

    dropTimerId[player] = setInterval(() => {
      if (canGoDown(playerIndexes, player)) {
        moveDown(player)
      }
    }, gameSpeed[player])

    gridUpdateTimerId[player] = setInterval(() => {
      updateGrid(player)
    }, 50)

  }

  function stopDropShapes(player) {
    clearInterval(canMoveCheckTimerId[player])
    clearInterval(dropTimerId[player])
    clearInterval(gridUpdateTimerId)
  }

  function moveRowsDown(row, player) {
    const occupiedSquares = grids[player].querySelectorAll('.shape-inactive')
    //console.log(occupiedSquares)
    for (let i = occupiedSquares.length-1; i >=0 ; i--) {
      const occupiedSquare = occupiedSquares[i]
      const occupiedSquareRow = occupiedSquare.dataset.row
      const position = parseInt(occupiedSquare.dataset.position)
      if (occupiedSquareRow < row) {
        occupiedSquare.classList.remove('shape-inactive')
        squares[player][(position+width)].classList.add('shape-inactive')
      }
    }

  }

  function checkCompletedRows(player) {
    //let completed = true
    let filledRows = ''

    checkRowsTimerId[player] = setInterval(() => {
      filledRows = []

      rows[player].forEach(row => {
        let count = 0
        for (let i = row[0]; i < row[0] + width; i++) {
          //console.log(squares[i])
          if (squares[player][i].classList.contains('shape-inactive')) {
            count++
          }
          //console.log(squares[i])
        }
        //sconsole.log(squares[row[0]].dataset.row, count, row.length)
        //console.log(count)
        if (count===row.length) {
          const filledRow = squares[player][row[0]].dataset.row

          for (let i = row[0]; i < row[0] + width; i++) {
            squares[player][i].classList.remove('shape-inactive')
            //console.log('full row')
          }
          filledRows.push(filledRow)
          score[player] += Math.floor(Math.pow(10,filledRows.length))
          scoreSpans[player].innerText = score[player]
        }
      })
      //console.log(`filledRows at end ${filledRows.length}`)
      //console.log(filledRows)
      if (filledRows.length > 0) {
        filledRows.forEach(row => moveRowsDown(row, player))
        if (gameSpeed[player] > 200) gameSpeed[player] -= filledRows.length * 50
        stopDropShapes(player)
        dropShapes(player)
      }
    }, 200)
  }

  function startGameTimer(players) {

    const gameStartTime = new Date()
    const time = { 1: 0, 2: 0}

    gameTimerId[1] = setInterval(() => {

      const gameCurrentTime = new Date()
      time[1] = (gameCurrentTime - gameStartTime)

      time[1] = Math.floor(time[1] / 1000)
      let minutes = Math.floor(time[1] / 60)
      let seconds = time[1]
      minutes < 1 ? minutes = 0 : seconds = time[1] - (minutes*60)
      if (minutes<10) minutes = '0' + minutes
      if (seconds<10) seconds = '0' + seconds
      timeSpans[1].innerText = `${minutes}:${seconds}`
    }, 1000)

    if (players === 2) {
      gameTimerId[2] = setInterval(() => {

        const gameCurrentTime = new Date()
        time[2] = (gameCurrentTime - gameStartTime)
        time[2] = Math.floor(time[2] / 1000)
        let minutes = Math.floor(time[2] / 60)
        let seconds = time[2]
        minutes < 1 ? minutes = 0 : seconds = time[2] - (minutes*60)
        if (minutes<10) minutes = '0' + minutes
        if (seconds<10) seconds = '0' + seconds
        timeSpans[2].innerText = `${minutes}:${seconds}`
      }, 1000)
    }
  }

  function stopGameTimer(player) {
    clearInterval(gameTimerId[player])
  }

  function checkLoss(player) {
    checkLossId[player] = setInterval(() => {
      if (reachedTop(player)) {
        gameEnd(player)
      }
    },200)
  }

  function stopCheckLoss(player) {
    clearInterval(checkLossId[player])
  }

  function resetGameSpeed() {
    gameSpeed[1] = 1000
    gameSpeed[2] = 1000
  }

  function gameStart(e) {
    let players = null
    e.target === start1Player ? players = 1 : players = 2
    toggleVisibility(loadPage)
    toggleVisibility(player1Tile)
    if (players === 2) toggleVisibility(player2Tile)
    generateGrid(players)
    getPlayerName(players)
    generateShapeQueue(players)

    for (let i = 1; i <= players; i++) {
      selectNextShape(i)
      displayQueue(i)
    }
    console.log(players)
    window.addEventListener('keydown', (e) => {
      handleKeyDown(e, players)
    })
    for (let i = 1; i <= players; i++) {
      dropShapes(i)
      checkCompletedRows(i)
    }

    startGameTimer(players)

    for (let i = 1; i <= players; i++) {
      checkLoss(i)
    }

  }

  function gameEnd(player) {
    stopGameTimer(player)
    stopCheckLoss(player)
    stopDropShapes(player)
    resetGameSpeed()
    displayMessage(player)
    window.addEventListener('click', goBackToLoadPage)
    window.removeEventListener('keydown', handleKeyDown)
  }

  function getPlayerName(players) {
    playerName[1] = window.prompt('Player 1 Enter Your Name', 'Player 1')
    if (players === 2) playerName[2] = window.prompt('Player 2 Enter Your Name', 'Player 2')
  }

  function displayMessage(player) {
    let highScoreMessage = ''
    if (checkIfHighScore(player)) highScoreMessage = '\nNew High Score!\n' + score[player]
    message[player].innerText = displayMessages[2] + highScoreMessage
    for (let i = 0; i < thisCSS.cssRules.length; i++) {
      if (thisCSS.cssRules[i].selectorText===`#message${player}`) {
        thisCSS.cssRules[i].style['display'] = 'unset'
      }
    }
  }

  function checkIfHighScore(player) {
    for (var i = 0; i < highScores.length; i++) {
      if (score[player] > highScores[i]['score']) {
        updateHighScore(player)
        return true
      }
    }
    return false
  }

  function updateHighScore(player) {
    highScores.pop()
    highScores.push({name: playerName[player], score: score[player]})
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

    squares[1].forEach(square => {
      square.classList.remove('shape')
      square.classList.remove('shape-ghost')
      square.classList.remove('shape-inactive')
    })
    squares[2].forEach(square => {
      square.classList.remove('shape')
      square.classList.remove('shape-ghost')
      square.classList.remove('shape-inactive')
    })
  }

  function goBackToLoadPage() {
    toggleVisibility(player1Tile)
    toggleVisibility(player2Tile)
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

    startButton.addEventListener('click', () => {
      toggleVisibility(start1Player)
      if (window.innerWidth >= 1024) {
        toggleVisibility(start2Player)
      }

    })

    startGameDiv.forEach(button => {
      button.addEventListener('click', (e) => {
        //console.log(e.target)
        if ((window.innerWidth < 1024) && (e.target === start2Player)) {
          window.alert('2 Player mode requires a larger screen')
        }
        gameStart(e)
      })
    })


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
      console.log('pause')
    })

    play.addEventListener('click', () => {
      mute.style.display = 'inline'
      play.style.display = 'none'
      music.play()
      music.loop()
      console.log('play')
    })



  }


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

  loadGame()

}

window.addEventListener('DOMContentLoaded', init)
