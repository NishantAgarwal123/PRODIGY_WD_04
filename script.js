
    const huPlayer = 'O';
    const aiPlayer = 'X';
    const winCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [6, 4, 2]
    ];

    let origBoard;
    const boxes = document.querySelectorAll('.box');
    const endgameDiv = document.querySelector('.endgame');

    startGame();

    function startGame() {
      endgameDiv.style.display = 'none';
      origBoard = Array.from(Array(9).keys());
      boxes.forEach(box => {
        box.innerText = '';
        box.style.removeProperty('background-color');
        box.addEventListener('click', turnClick, false);
      });
    }

    function turnClick(square) {
      const squareId = square.target.id;
      if (typeof origBoard[squareId] == 'number') {
        turn(squareId, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
      }
    }

    function turn(squareId, player) {
      origBoard[squareId] = player;
      document.getElementById(squareId).innerText = player;
      const gameWon = checkWin(origBoard, player);
      if (gameWon) gameOver(gameWon);
    }

    function checkWin(board, player) {
      const plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
      let gameWon = null;
      for (const [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
          gameWon = { index, player };
          break;
        }
      }
      return gameWon;
    }

    function gameOver(gameWon) {
      for (const index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
          (gameWon.player === huPlayer) ? 'blue' : 'red';
      }
      boxes.forEach(box => box.removeEventListener('click', turnClick, false));
      declareWinner((gameWon.player === huPlayer) ? 'You win!' : 'You lose.');
    }

    function declareWinner(who) {
      endgameDiv.style.display = 'block';
      endgameDiv.querySelector('.text').innerText = who;
    }

    function emptySquares() {
      return origBoard.filter(s => typeof s == 'number');
    }

    function bestSpot() {
      return minimax(origBoard, aiPlayer).index;
    }

    function checkTie() {
      if (emptySquares().length === 0) {
        boxes.forEach(box => {
          box.style.backgroundColor = 'green';
          box.removeEventListener('click', turnClick, false);
        });
        declareWinner('Tie Game!');
        return true;
      }
      return false;
    }

    function minimax(newBoard, player) {
      const availSpots = emptySquares();

      if (checkWin(newBoard, huPlayer)) {
        return { score: -10 };
      } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
      } else if (availSpots.length === 0) {
        return { score: 0 };
      }

      const moves = [];
      for (const spot of availSpots) {
        const move = { index: newBoard[spot] };
        newBoard[spot] = player;

        if (player === aiPlayer) {
          move.score = minimax(newBoard, huPlayer).score;
        } else {
          move.score = minimax(newBoard, aiPlayer).score;
        }

        newBoard[spot] = move.index;
        moves.push(move);
      }

      let bestMove;
      if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }

      return moves[bestMove];
    }
  