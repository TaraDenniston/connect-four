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

  // check for tie: if all cells in board are filled, game ends
  if (board.every(row => (row.every(cell => cell !== null)))) {
    return endGame("Game Over - Tie!");
  }

  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1; 
  document.getElementById("column-top").setAttribute("class", `c${currPlayer}`);
  document.getElementById("text").innerText = `Player ${currPlayer}'s Turn`;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Check through every cell on the board
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {

      // don't bother checking if current cell is empty
      if (board[y][x] === null) {
        continue;
      }

      // horiz includes current cell & 3 cells to the right
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // vert includes current cell & 3 cells below
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // diagDR includes current cell and 3 cells diagonally down to the right
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // diagDR includes current cell and 3 cells diagonally down to the left
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if values in any set of 4 are a legal win for current player, return true
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
