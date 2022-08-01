/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let gameOver = false;
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // Create JS board dynamically using WIDTH and HEIGHT constants
  for (let y = 0; y < HEIGHT; y++) {
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      board[y][x] = null;
    }
  }
}


/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // Create "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.querySelector("#board");

  // Create table elements for row of column tops
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.setAttribute("class", `c${currPlayer}`);
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Create table elements for all cells on the board
  for (var y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // return the y coordinate of the lowest available cell in column x
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      return y;
    }
  }
  // if no cells are available, return null
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // Make a div and insert into correct table cell
  const pieceDiv = document.createElement("div");
  const currCell = document.getElementById(`${y}-${x}`);
  pieceDiv.classList.add("piece");
  pieceDiv.classList.add(`p${currPlayer}`);
  pieceDiv.classList.add(`drop${y + 1}`);
  currCell.append(pieceDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  document.getElementById("text1").innerText = msg;
  document.getElementById("text2").innerText = "Refresh to begin a new game";
  gameOver = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // don't respond to click if game has ended
  if (gameOver) {
    return;
  }

  // get x from ID of clicked cell
  const x = evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  //update in-memory board
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Game Over - Player ${currPlayer} Wins!`);
  }

  // check for tie: if all cells in the top row are filled, game ends
  if (board[0].every(cell => cell !== null)) {
    return endGame("Game Over - Tie!");
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1; 
  document.getElementById("column-top").setAttribute("class", `c${currPlayer}`);
  document.getElementById("text1").innerText = `Player ${currPlayer}'s Turn`;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  let winDetected = false;

  // helper function: only return true if the given cell is on the board, not empty, 
  // and belongs to current player
  const cellCounted = (y, x) => {
    return y > -1 && y < HEIGHT && 
           x > -1 && x < WIDTH && 
           board[y][x] !== null &&
           board[y][x] === currPlayer; 
  };

  // helper function: return count of matching horizontal cells in a row
  const checkHoriz = (y, x)  => {
    let counter = 1;
    let fromOrigin = 1;

    // check horizontally to the right for cells belonging to current player
    let tempX = x + 1;
    while (cellCounted(y, tempX) && fromOrigin < 4) {
      counter++;
      tempX++;
      fromOrigin++;      
    }

    // check horizontally to the left for cells belonging to current player
    fromOrigin = 1;
    tempX = x - 1;
    while (cellCounted(y, tempX) && fromOrigin < 4) {
      counter++;
      tempX--;
      fromOrigin++;      
    }

    return counter;
  };

  // helper function: return count of matching vertical cells in a row
  const checkVert = (y, x)  => {
    let counter = 1;
    let fromOrigin = 1;

    // check vertically upwards for cells belonging to current player
    let tempY = y - 1;
    while (cellCounted(tempY, x) && fromOrigin < 4) {
      counter++;
      tempY--;
      fromOrigin++;      
    }

    // check vertically downwards for cells belonging to current player
    fromOrigin = 1;
    tempY = y + 1;
    while (cellCounted(tempY, x) && fromOrigin < 4) {
      counter++;
      tempY++;
      fromOrigin++;      
    }

    return counter;
  };

  // helper function: return count of matching ascending diagonal cells in a row
  const checkAscenDiag = (y, x)  => {
    let counter = 1;
    let fromOrigin = 1;

    // check diagonally up/right for cells belonging to current player
    let tempY = y - 1;
    let tempX = x + 1;
    while (cellCounted(tempY, tempX) && fromOrigin < 4) {
      counter++;
      tempY--;
      tempX++;
      fromOrigin++;      
    }

    // check diagonally down/left for cells belonging to current player
    fromOrigin = 1;
    tempY = y + 1;
    tempX = x - 1;
    while (cellCounted(tempY, tempX) && fromOrigin < 4) {
      counter++;
      tempY++;
      tempX--;
      fromOrigin++;      
    }
  };

  // helper function: return count of matching descending diagonal cells in a row
  const checkDescenDiag = (y, x)  => {
    let counter = 1;
    let fromOrigin = 1;

    // check diagonally down/right for cells belonging to current player
    let tempY = y + 1;
    let tempX = x + 1;
    while (cellCounted(tempY, tempX) && fromOrigin < 4) {
      counter++;
      tempY++;
      tempX++;
      fromOrigin++;      
    }

    // check diagonally up/left for cells belonging to current player
    fromOrigin = 1;
    tempY = y - 1;
    tempX = x - 1;
    while (cellCounted(tempY, tempX) && fromOrigin < 4) {
      counter++;
      tempY--;
      tempX--;
      fromOrigin++;      
    }

    return counter;
  };  

  // Check through every cell on the board
  OUTER: for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {

      // don't bother checking if current cell is empty or belongs to other player
      if (board[y][x] === null || board[y][x] !== currPlayer) {
        continue;
      }
      
      // current player wins if they have 4 pieces in a row diagonally, horizontally, or 
      // verically based on up to 3 valid cells out from current cell in each direction
      if (checkHoriz(y, x) > 3 || checkVert(y, x) > 3 || 
          checkAscenDiag(y, x) > 3 || checkDescenDiag(y, x) > 3) {
        winDetected = true;
        break OUTER;
      }
    }
  }

  return winDetected;
}

makeBoard();
makeHtmlBoard();
