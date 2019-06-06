const height = 20
const width = 10
const squares = []
let playerIndexes = []
let previousIndexes = []
let ghostIndexes = []
const rows = []
let dropTimerId = null
let canMoveCheckTimerId = null
let checkRowsTimerId = null
// let keyDelayId = null
let checkLossId = null
let score = 0
let player1Name = ''
let player2Name = ''
let gameTimerId = null
const shapeNames = ['I', 'O', 'T', 'J', 'L', 'S', 'Z']
const shapeQueue = []
let activeShape = null
const displayMessages = ['You Win!', 'You Lose', 'Game Over']
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
  // console.log()
  const grid1 = document.querySelector('#grid1')
  const thisCSS = document.styleSheets[0]
  const loadPage = document.querySelector('#load-page')
  const startButton = document.querySelector('#start-game-button')
  const start1Player = document.querySelector('#start1Player')
  const start2Player = document.querySelector('#start2Player')
  const player1Tile = document.querySelector('#player1')
  const player2Tile = document.querySelector('#player2')
  const message1 = document.querySelector('#gameboard1 p.message')
  const instructionsButton = document.querySelector('#instructions-button')
  const instructions = document.querySelector('#instructions')
  const highScoreButton = document.querySelector('#high-score-button')
  const highScoreDiv = document.querySelector('#high-scores')
  const highScoreResults = document.querySelectorAll('#high-scores > small')
  const themeButtons = document.querySelectorAll('footer > p')

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
    //console.log(shapeQueue)
    // for (var i = 0; i < shapeQueue.length; i++) {
    //   shapeQueue[i]
    // }


  }

  function displayQueue() {
    const s = document.querySelector('#shapequeue1')
    //console.log(s)
    //console.log(s.children.length)

    for (var i = 0; i < s.children.length; i++) {
      const div = s.children[i]
      const name = shapeQueue[i].name
      // div.style.background = `'url('../assets/${name}.png')'`
      div.style.backgroundImage = 'url("./assets/' + name + '.png")'
      //console.log(div.style)
    }

    // first.innerText = shapeQueue[0].name
    // second.innerText = shapeQueue[1].name
    // third.innerText = shapeQueue[2].name
    // fourth.innerText = shapeQueue[3].name
    // fifth.innerText = shapeQueue[4].name
  }

  function generateNewShape() {

    const newShape = new Tetromino(shapeNames[Math.floor(Math.random() * shapeNames.length)])

    shapeQueue.push(newShape)

  }

  function selectNextShape() {
    activeShape = shapeQueue.shift()
    //console.log(activeShape)
    playerIndexes = []
    activeShape.positions.forEach(position => playerIndexes.push(position))
    for (let i = 0; i < playerIndexes.length; i++) {
      squares[playerIndexes[i]].classList.add('shape')
      //console.log(squares)
    }
    // const color = colors[Math.floor(Math.random() * 4)]

    // document.styleSheets[0].cssRules[1].style['backgroundColor'] = 'green'
    // console.log(document.styleSheets[0].cssRules[1])
    //console.log(thisCSS.cssRules)
    //const cssRulesArray = []
    //console.log(activeShape)
    for (let i = 0; i < thisCSS.cssRules.length; i++) {
      if (thisCSS.cssRules[i].selectorText === '.shape' || thisCSS.cssRules[i].selectorText === '.shape-ghost') {
        thisCSS.cssRules[i].style['backgroundColor'] = activeShape.color
      }
      // cssRulesArray.push(thisCSS.cssRules[i])
      // console.log(thisCSS.cssRules[i].selectorText)
    }
    //console.log(shapeQueue)
  }

  function displayGhost() {
    ghostIndexes = []
    //playerIndexes.forEach(index => ghostIndexes.push(index))
    for (let i = 0; i < playerIndexes.length; i++) {
      ghostIndexes.push(playerIndexes[i])
    }

    while (canGoDown(ghostIndexes)) {
      //ghostIndexes.forEach(index => index = index + width + width + width + width)
      //console.log(ghostIndexes)
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

  function canGoUp() {
    for (let i = playerIndexes.length-1; i >= 0; i--) {
      const position = playerIndexes[i]
      if (position - width < 0) {
        //console.log('cant go up')
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

      //console.log((before))
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
    // squares.forEach(square => square.classList.remove('shape'))
    indexes.forEach(index => squares[index])
    for (let i = 0; i < indexes.length; i++) {
      //console.log(squares[indexes[i]])
      squares[indexes[i]].classList.remove('shape')
      // console.log(squares[indexes[i]])
    }
    squares.forEach(square => square.classList.remove('shape-ghost'))

    playerIndexes.forEach(index => squares[index].classList.add('shape'))
    displayGhost()
    // console.log(document.querySelectorAll('.shape-ghost'))
    // console.log(playerIndexes)
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
    //console.log(occupiedSquares)
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
    //let completed = true
    const scoreSpan1 = document.querySelector('#score1')
    let filledRows = ''

    checkRowsTimerId = setInterval(() => {
      filledRows = []

      rows.forEach(row => {
        let count = 0
        for (let i = row[0]; i < row[0] + width; i++) {
          //console.log(squares[i])
          if (squares[i].classList.contains('shape-inactive')) {
            count++
          }
          //console.log(squares[i])
        }
        //sconsole.log(squares[row[0]].dataset.row, count, row.length)
        //console.log(count)
        if (count===row.length) {
          const filledRow = squares[row[0]].dataset.row

          for (let i = row[0]; i < row[0] + width; i++) {
            squares[i].classList.remove('shape-inactive')
            //console.log('full row')
          }
          filledRows.push(filledRow)
          score += 10 * filledRows.length
          scoreSpan1.innerText = score
        }
      })
      //console.log(`filledRows at end ${filledRows.length}`)
      //console.log(filledRows)
      if (filledRows.length > 0) {
        filledRows.forEach(row => moveRowsDown(row))
        if (gameSpeed > 100) gameSpeed -= filledRows.length * 50
        stopDropShapes()
        dropShapes()
      }
    }, 200)
  }

  function startGameTimer() {
    const timeSpan1 = document.querySelector('#timespan1')
    //const timeSpan2 = document.querySelector('#timespan2')
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
      //timeSpan2.innerText = `${minutes}:${seconds}`
      // if (time>60) stopGameTimer()
    }, 1000)

  }

  function stopGameTimer() {
    clearInterval(gameTimerId)
  }

  function checkLoss() {
    checkLossId = setInterval(() => {
      //console.log(reachedTop())
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
    toggleVisibility(start1Player)
    //toggleVisibility(start2Player)
    toggleVisibility(player1Tile)
    generateGrid()
    getPlayerName()
    //generateNewShape()
    generateShapeQueue()
    selectNextShape()
    displayQueue()
    window.addEventListener('keydown', handleKeyDown)
    // moveShape()
    dropShapes()
    checkCompletedRows()
    startGameTimer()

    checkLoss()

  }

  function gameEnd() {
    stopGameTimer()
    stopCheckLoss()
    stopDropShapes()
    displayMessage()
    window.addEventListener('click', goBackToLoadPage)
    window.removeEventListener('keydown', handleKeyDown)
  }

  function getPlayerName() {
    player1Name = window.prompt('Enter Your Name', 'Player 1')
  }

  function displayMessage() {
    let highScoreMessage = ''
    if (checkIfHighScore()) highScoreMessage = '\nNew High Score!\n' + score
    message1.innerText = displayMessages[2] + highScoreMessage
    for (var i = 0; i < thisCSS.cssRules.length; i++) {
      if (thisCSS.cssRules[i].selectorText==='.message') {
        thisCSS.cssRules[i].style['display'] = 'unset'
      }
    }
  }

  function checkIfHighScore() {
    for (var i = 0; i < highScores.length; i++) {
      if (score > highScores[i]['score']) {
        //highScores.pop()
        updateHighScore()
        return true
      }
    }
    return false
  }

  function updateHighScore() {
    // const newHighScores = []
    //console.log(highScores)
    // for (var i = 0; i < highScores.length; i++) {
    //   if (score > highScores[i]['score']) {
    //     newHighScores.push({name: player1Name, score: score})
    //   } else {
    //     newHighScores.push(highScores[i])
    //   }
    // }
    highScores.pop()
    highScores.push({name: player1Name, score: score})
    //console.log(highScores)
    sortHighScores()
    saveHighScores()
    displayHighScores()

  }

  function sortHighScores() {
    highScores.sort((a,b) => {
      // b.score - a.score
      return a.score > b.score ?  -1 : 1
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
    console.log(highScores)
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
    // player1Tile.style.display = 'none'
    // player2Tile.style.display = 'none'
    // loadPage.style.display = 'flex'
    toggleVisibility(player1Tile)
    //toggleVisibility(player2Tile)
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
        //console.log(element.id, thisCSS.cssRules[i].style['display'])
      }
    }
    // console.log(element, element.style.display)
    // if (element.style.display === 'none') {
    //   element.style.display = 'flex'
    //   return
    // } else {
    //   element.style.display = 'none'
    // }
  }

  function changeTheme(theme) {
    if (theme === 'classic') {
      document.body.style.backgroundColor = 'white'
    } else {
      document.body.style.backgroundColor = 'black'
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

    start1Player.addEventListener('click', gameStart)

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
