# General Assembly SEI Project 1: Tetris


## Introduction
The goal was to recreate the classic arcade game of Tetris using vanilla JavaScript.

This was Project 1 for the Software Engineering Immersive course at General Assembly.


## Technologies Used
- HTML5
- CSS3
- JavaScript
- Git
- GitHub

## Timeframe
1 Week (May 2019)

## Deployment
The project is currently deployed at http://shaneshibu.com/sei-project-1/

## Overview

![Tetris Main Screen](assets/screenshots/main.gif)

The Tetris game requires players to strategically rotate, move, and drop a procession of Tetriminos that fall into the rectangular Matrix at increasing speeds. Players attempt to clear as many lines as possible by completing horizontal rows of blocks without empty space, but if the Tetriminos surpass the Skyline the game is over!

![Tetris Game Screen](assets/screenshots/gamescreen2.gif)

## Controls

- Move the falling tetrimino: ← → ↓ keys
- Rotate: ↑ key

## Making the Game

### Generating the grid
First I had to create a 10X20 grid that would be the game board. This was created in JavaScript then appended to the DOM each time a new game was started inside the div with the id 'grid1'.

```javascript
const grid1 = document.querySelector('#grid1')

function generateGrid() {

  for (let i = 0; i < width * height; i++) {
    const square = document.createElement('div')
    square.classList.add('grid-item')
    square.dataset.position = i
    squares.push(square)
    grid1.append(square)
  }

}

```

Each square in the grid was an empty div element with the class 'grid-item'. The squares' size and style was applied using CSS.

### Generating the Tetriminos

There are seven different tetrimino shapes in Tetris that must be randomly generated at the top of the grid. While I could have created seven different shape variables, I instead chose to create a single tetrimino class which stored the starting positions of each shape.

```javascript
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
}
```

Generating a new tetrimino then just involved create a new tetrimino class


## Wins
One of the biggest wins for me during this project was my solution for rotating tetriminos without repeating my code where I could avoid it. By creating a single Tetrimino Class and storing the rotation logic inside the class, rotating a tetrimino only required one function (Tetrimino.rotate()) regardless of which of the 7 shapes was currently active.

```javascript
class Tetromino {
  constructor(name) {...}
  initialPosition(name) {...}
  setColor(name) {...}
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
      J: {...}
      L: {...}
      S: {...}
      Z: {...}
    }

    this.positions[0] = rotatedPositions[this.name][this.orientation][0]
    this.positions[1] = rotatedPositions[this.name][this.orientation][1]
    this.positions[2] = rotatedPositions[this.name][this.orientation][2]
    this.positions[3] = rotatedPositions[this.name][this.orientation][3]
    // if shape orientation is 270°, change to 0° else add 90°
    this.orientation !== 270 ? this.orientation += 90 : this.orientation = 0

    return this.positions
  }
}
```
By passing in the current active shape's position, the shape's rotate function would return the new rotated position for that shape.

While this may not have been the most concise solution to this problem, by having the rotate method inside the class, the code was much more organised and compartmentalised.

## Challenges
One of the biggest challenges was clearing rows when they were completed. Not only did the game have to check if each row had been filled, but after clearing each filled row the game had to move all the squares above those rows down by one. Having multiple timers running to check for filled rows while dropping the tetrimino proved to be tricky.

One persistent bug that I was unable to solve appeared when clearing multiple rows at once. Since more points are scored when clearing multiple rows simultaneously, a winning tactic is to let levels build up then clearing them all at once. However for some reason in my game when doing this, any blocks in the top half of the grid remained in their position instead of moving down one row. This bug did not occur when only one row was cleared at a time. I have not been able to determine the reason for this behaviour.

![Tetris Game Screen Bug](assets/screenshots/bug.gif)

I faced another challenge when implementing a 2 player mode. This would mean there would be 2 grids side by side on the screen, and 2 players could use different keys on the same keyboard to play at the same time. Each time a player cleared a row on their grid, that row would be permanently added to their opponents grid. While I did manage to get this working there were bugs. By doubling the players, I was also doubling the number of JavaScript timers running in the background. This made the game start to lag. And while players could use the same keyboard, the keyboard couldn't accept input from 2 keys simultaneously, which caused problems if one player held a key down.

## Future Features
One oversight I didn't have time to correct was making the game playable on mobile devices. While I did use a mobile first design approach, the only player input I included was via a keyboard. To make the game playable on mobile devices, I would add on screen buttons, so users could play via touchscreen.
