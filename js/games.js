
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
if (menuToggle && navMenu) menuToggle.addEventListener("click", () => navMenu.classList.toggle("show"));

const pickerButtons = document.querySelectorAll(".picker-btn");
const modeButtons = document.querySelectorAll(".mode-btn");
const gameTitle = document.getElementById("gameTitle");
const gameStatus = document.getElementById("gameStatus");
const gameContainer = document.getElementById("gameContainer");
const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const resetScores = document.getElementById("resetScores");
const newRound = document.getElementById("newRound");
const helpModal = document.getElementById("helpModal");
const closeHelp = document.getElementById("closeHelp");
const howToPlayBtn = document.getElementById("howToPlayBtn");
const helpTitle = document.getElementById("helpTitle");
const helpText = document.getElementById("helpText");

let currentGame = "tictactoe";
let mode = "ai";
let scores = { player: 0, computer: 0 };

const gameNames = {
    tictactoe: "Tic Tac Toe",
    rps: "Rock Paper Scissors",
    chess: "Full Chess"
};

const help = {
    tictactoe: "Place X on the board. Get three in a row horizontally, vertically, or diagonally. In computer mode, the computer plays O.",
    rps: "Choose Rock, Paper or Scissors. The game now shows your hand and the opponent hand clearly. Rock beats Scissors, Scissors beats Paper, and Paper beats Rock.",
    chess: "Full 8x8 chess board. White starts. Click a piece, then click a highlighted square. Pieces move normally. Pawns promote when they reach the last rank. This version includes normal movement and captures, but does not include castling or en passant."
};

function updateScores() {
    playerScoreEl.textContent = scores.player;
    computerScoreEl.textContent = scores.computer;
}

function setStatus(message) {
    gameStatus.textContent = message;
}

function addPlayerPoint() {
    scores.player++;
    updateScores();
}

function addComputerPoint() {
    scores.computer++;
    updateScores();
}

pickerButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        pickerButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentGame = btn.dataset.game;
        gameTitle.textContent = gameNames[currentGame];
        renderGame();
    });
});

modeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        modeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        mode = btn.dataset.mode;
        renderGame();
    });
});

newRound.addEventListener("click", renderGame);

resetScores.addEventListener("click", () => {
    scores = { player: 0, computer: 0 };
    updateScores();
    setStatus("Scores have been reset.");
});

howToPlayBtn.addEventListener("click", () => {
    helpTitle.textContent = `How to Play ${gameNames[currentGame]}`;
    helpText.textContent = help[currentGame];
    helpModal.classList.remove("hidden");
});

closeHelp.addEventListener("click", () => helpModal.classList.add("hidden"));
helpModal.addEventListener("click", e => {
    if (e.target === helpModal) helpModal.classList.add("hidden");
});

function renderGame() {
    gameContainer.innerHTML = "";
    gameTitle.textContent = gameNames[currentGame];

    if (currentGame === "tictactoe") renderTicTacToe();
    if (currentGame === "rps") renderRPS();
    if (currentGame === "chess") renderFullChess();
}

/* TIC TAC TOE */
function renderTicTacToe() {
    let board = Array(9).fill("");
    let currentPlayer = "X";
    let locked = false;

    setStatus(mode === "ai" ? "You are X. Make your move." : "Player X turn.");

    const boardEl = document.createElement("div");
    boardEl.className = "ttt-board";
    gameContainer.appendChild(boardEl);

    function draw() {
        boardEl.innerHTML = "";
        board.forEach((cell, index) => {
            const btn = document.createElement("button");
            btn.className = "ttt-cell";
            btn.textContent = cell;
            btn.addEventListener("click", () => makeMove(index));
            boardEl.appendChild(btn);
        });
    }

    function winner() {
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        for (const [a,b,c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
        }
        if (board.every(Boolean)) return "draw";
        return null;
    }

    function finish(result) {
        locked = true;
        if (result === "draw") {
            setStatus("It is a draw. Click New Round.");
        } else {
            setStatus(`${result} wins!`);
            result === "X" ? addPlayerPoint() : addComputerPoint();
        }
    }

    function computerMove() {
        const empty = board.map((v,i) => v ? null : i).filter(v => v !== null);
        if (!empty.length) return;

        const winOrBlock = (mark) => {
            for (const idx of empty) {
                const test = [...board];
                test[idx] = mark;
                const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
                if (lines.some(([a,b,c]) => test[a] && test[a] === test[b] && test[a] === test[c])) return idx;
            }
            return null;
        };

        let pick = winOrBlock("O");
        if (pick === null) pick = winOrBlock("X");
        if (pick === null && board[4] === "") pick = 4;
        if (pick === null) pick = empty[Math.floor(Math.random() * empty.length)];

        board[pick] = "O";
        draw();
        const result = winner();
        if (result) finish(result);
        else setStatus("Your turn.");
    }

    function makeMove(index) {
        if (locked || board[index]) return;
        board[index] = currentPlayer;
        draw();

        const result = winner();
        if (result) return finish(result);

        if (mode === "ai") {
            setStatus("Computer is thinking...");
            setTimeout(computerMove, 350);
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            setStatus(`Player ${currentPlayer} turn.`);
        }
    }

    draw();
}

/* ROCK PAPER SCISSORS WITH HAND DISPLAY */
/* ROCK PAPER SCISSORS WITH TRUE LOCAL MULTIPLAYER */
function renderRPS() {
    setStatus(mode === "ai" ? "Choose your hand." : "Player 1, choose your hand secretly.");

    gameContainer.innerHTML = `
        <div class="rps-wrap">
            <div class="hand-display">
                <div class="hand-card">
                    <strong>You / Player 1</strong>
                    <div class="big-hand" id="playerHand">❔</div>
                </div>
                <div class="versus">VS</div>
                <div class="hand-card">
                    <strong>${mode === "ai" ? "Computer" : "Player 2"}</strong>
                    <div class="big-hand" id="computerHand">❔</div>
                </div>
            </div>

            <div class="choices">
                <button class="choice-btn" data-choice="rock">✊<span>Rock</span></button>
                <button class="choice-btn" data-choice="paper">✋<span>Paper</span></button>
                <button class="choice-btn" data-choice="scissors">✌️<span>Scissors</span></button>
            </div>

            <div class="result-box" id="rpsResult">
                ${mode === "ai" ? "Pick one hand to begin." : "Player 1 should choose first. The choice will be hidden."}
            </div>
        </div>
    `;

    const resultBox = document.getElementById("rpsResult");
    const playerHand = document.getElementById("playerHand");
    const computerHand = document.getElementById("computerHand");

    const choices = ["rock", "paper", "scissors"];
    const emojis = {
        rock: "✊",
        paper: "✋",
        scissors: "✌️"
    };

    let playerOneChoice = null;
    let waitingForPlayerTwo = false;

    document.querySelectorAll(".choice-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const selected = btn.dataset.choice;

            // VS COMPUTER MODE
            if (mode === "ai") {
                const opponent = choices[Math.floor(Math.random() * choices.length)];
                const result = getRPSWinner(selected, opponent);

                playerHand.textContent = emojis[selected];
                computerHand.textContent = emojis[opponent];

                if (result === "player") {
                    addPlayerPoint();
                    setStatus("You win this round!");
                    resultBox.textContent = `You chose ${selected}. Computer chose ${opponent}. You win!`;
                } else if (result === "computer") {
                    addComputerPoint();
                    setStatus("Computer wins this round.");
                    resultBox.textContent = `You chose ${selected}. Computer chose ${opponent}. Computer wins.`;
                } else {
                    setStatus("Draw round.");
                    resultBox.textContent = `You both chose ${selected}. It is a draw.`;
                }

                return;
            }

            // VS PLAYER MODE
            if (!waitingForPlayerTwo) {
                playerOneChoice = selected;
                waitingForPlayerTwo = true;

                // Hide Player 1's real choice
                playerHand.textContent = "✅";
                computerHand.textContent = "❔";

                setStatus("Player 2, choose your hand.");
                resultBox.textContent = "Player 1 has chosen. Now Player 2 should choose.";
                return;
            }

            const playerTwoChoice = selected;
            const result = getRPSWinner(playerOneChoice, playerTwoChoice);

            playerHand.textContent = emojis[playerOneChoice];
            computerHand.textContent = emojis[playerTwoChoice];

            if (result === "player") {
                addPlayerPoint();
                setStatus("Player 1 wins this round!");
                resultBox.textContent = `Player 1 chose ${playerOneChoice}. Player 2 chose ${playerTwoChoice}. Player 1 wins!`;
            } else if (result === "computer") {
                addComputerPoint();
                setStatus("Player 2 wins this round!");
                resultBox.textContent = `Player 1 chose ${playerOneChoice}. Player 2 chose ${playerTwoChoice}. Player 2 wins!`;
            } else {
                setStatus("Draw round.");
                resultBox.textContent = `Both players chose ${playerOneChoice}. It is a draw.`;
            }

            playerOneChoice = null;
            waitingForPlayerTwo = false;

            setTimeout(() => {
                if (currentGame === "rps" && mode === "pvp") {
                    playerHand.textContent = "❔";
                    computerHand.textContent = "❔";
                    setStatus("Player 1, choose your hand secretly.");
                    resultBox.textContent = "Next round: Player 1 should choose first.";
                }
            }, 1600);
        });
    });
}
function getRPSWinner(player, computer) {
    if (player === computer) return "draw";

    if (
        (player === "rock" && computer === "scissors") ||
        (player === "paper" && computer === "rock") ||
        (player === "scissors" && computer === "paper")
     {
        return "player";
    }

    return "computer";
}

/* FULL CHESS */
function renderFullChess() {
    setStatus("White to move. Select a piece.");
    const pieces = {
        wr: "♖", wn: "♘", wb: "♗", wq: "♕", wk: "♔", wp: "♙",
        br: "♜", bn: "♞", bb: "♝", bq: "♛", bk: "♚", bp: "♟"
    };

    let board = [
        ["br","bn","bb","bq","bk","bb","bn","br"],
        ["bp","bp","bp","bp","bp","bp","bp","bp"],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["","","","","","","",""],
        ["wp","wp","wp","wp","wp","wp","wp","wp"],
        ["wr","wn","wb","wq","wk","wb","wn","wr"]
    ];

    let selected = null;
    let legalMoves = [];
    let turn = "w";
    let capturedWhite = [];
    let capturedBlack = [];
    let gameOver = false;
    let promotionTarget = null;

    gameContainer.innerHTML = `
        <div class="chess-wrap">
            <div class="chess-layout">
                <div class="chess-board-wrap">
                    <div class="chess-board" id="chessBoard"></div>
                </div>
                <aside class="chess-side">
                    <h3>Chess Panel</h3>
                    <span class="turn-pill" id="turnPill">White turn</span>
                    <p><strong>Captured by White:</strong></p>
                    <div class="captured" id="capturedByWhite">—</div>
                    <p><strong>Captured by Black:</strong></p>
                    <div class="captured" id="capturedByBlack">—</div>
                    <div class="promotion-box" id="promotionBox">
                        <button data-promote="q">♕</button>
                        <button data-promote="r">♖</button>
                        <button data-promote="b">♗</button>
                        <button data-promote="n">♘</button>
                    </div>
                    <p class="chess-help">Click a piece, then click a green dot. Normal piece movement is included. Castling and en passant are not included.</p>
                </aside>
            </div>
        </div>
    `;

    const boardEl = document.getElementById("chessBoard");
    const turnPill = document.getElementById("turnPill");
    const capturedByWhite = document.getElementById("capturedByWhite");
    const capturedByBlack = document.getElementById("capturedByBlack");
    const promotionBox = document.getElementById("promotionBox");

    function colorOf(piece) {
        return piece ? piece[0] : "";
    }

    function typeOf(piece) {
        return piece ? piece[1] : "";
    }

    function inside(r, c) {
        return r >= 0 && r < 8 && c >= 0 && c < 8;
    }

    function isEnemy(piece, color) {
        return piece && colorOf(piece) !== color;
    }

    function addSlideMoves(moves, r, c, color, directions) {
        for (const [dr, dc] of directions) {
            let nr = r + dr;
            let nc = c + dc;
            while (inside(nr, nc)) {
                if (!board[nr][nc]) {
                    moves.push({ r: nr, c: nc });
                } else {
                    if (isEnemy(board[nr][nc], color)) moves.push({ r: nr, c: nc, capture: true });
                    break;
                }
                nr += dr;
                nc += dc;
            }
        }
    }

    function getMoves(r, c) {
        const piece = board[r][c];
        if (!piece) return [];
        const color = colorOf(piece);
        const type = typeOf(piece);
        const moves = [];

        if (type === "p") {
            const dir = color === "w" ? -1 : 1;
            const startRow = color === "w" ? 6 : 1;
            if (inside(r + dir, c) && !board[r + dir][c]) {
                moves.push({ r: r + dir, c });
                if (r === startRow && !board[r + dir * 2][c]) moves.push({ r: r + dir * 2, c });
            }
            for (const dc of [-1, 1]) {
                const nr = r + dir;
                const nc = c + dc;
                if (inside(nr, nc) && isEnemy(board[nr][nc], color)) moves.push({ r: nr, c: nc, capture: true });
            }
        }

        if (type === "r") addSlideMoves(moves, r, c, color, [[1,0],[-1,0],[0,1],[0,-1]]);
        if (type === "b") addSlideMoves(moves, r, c, color, [[1,1],[1,-1],[-1,1],[-1,-1]]);
        if (type === "q") addSlideMoves(moves, r, c, color, [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);

        if (type === "n") {
            const jumps = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
            for (const [dr, dc] of jumps) {
                const nr = r + dr;
                const nc = c + dc;
                if (inside(nr, nc) && colorOf(board[nr][nc]) !== color) {
                    moves.push({ r: nr, c: nc, capture: !!board[nr][nc] });
                }
            }
        }

        if (type === "k") {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = r + dr;
                    const nc = c + dc;
                    if (inside(nr, nc) && colorOf(board[nr][nc]) !== color) {
                        moves.push({ r: nr, c: nc, capture: !!board[nr][nc] });
                    }
                }
            }
        }

        return moves;
    }

    function findKing(color) {
        const king = color + "k";
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === king) return { r, c };
            }
        }
        return null;
    }

    function isKingInCheck(color) {
        const king = findKing(color);
        if (!king) return false;
        const enemy = color === "w" ? "b" : "w";
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (colorOf(board[r][c]) === enemy) {
                    const moves = getMoves(r, c);
                    if (moves.some(m => m.r === king.r && m.c === king.c)) return true;
                }
            }
        }
        return false;
    }

    function drawChess() {
        boardEl.innerHTML = "";
        const whiteKing = findKing("w");
        const blackKing = findKing("b");
        const whiteCheck = isKingInCheck("w");
        const blackCheck = isKingInCheck("b");

        turnPill.textContent = turn === "w" ? "White turn" : "Black turn";
        capturedByWhite.textContent = capturedWhite.length ? capturedWhite.map(p => pieces[p]).join(" ") : "—";
        capturedByBlack.textContent = capturedBlack.length ? capturedBlack.map(p => pieces[p]).join(" ") : "—";

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const cell = document.createElement("button");
                const piece = board[r][c];
                const legal = legalMoves.find(m => m.r === r && m.c === c);

                cell.className = `chess-cell ${(r + c) % 2 === 0 ? "light" : "dark"}`;
                if (selected && selected.r === r && selected.c === c) cell.classList.add("selected");
                if (legal) cell.classList.add(piece ? "capture" : "legal");
                if (whiteCheck && whiteKing && whiteKing.r === r && whiteKing.c === c) cell.classList.add("in-check");
                if (blackCheck && blackKing && blackKing.r === r && blackKing.c === c) cell.classList.add("in-check");

                cell.textContent = pieces[piece] || "";
                cell.addEventListener("click", () => handleChessClick(r, c));
                boardEl.appendChild(cell);
            }
        }
    }

    function handleChessClick(r, c) {
        if (gameOver || promotionTarget) return;

        const piece = board[r][c];

        if (selected) {
            const move = legalMoves.find(m => m.r === r && m.c === c);
            if (move) {
                makeChessMove(selected.r, selected.c, r, c);
                return;
            }
        }

        if (piece && colorOf(piece) === turn) {
            selected = { r, c };
            legalMoves = getMoves(r, c);
            setStatus(`${turn === "w" ? "White" : "Black"} selected ${pieces[piece]}. Choose a highlighted square.`);
        } else {
            selected = null;
            legalMoves = [];
            setStatus(`${turn === "w" ? "White" : "Black"} to move. Select your own piece.`);
        }

        drawChess();
    }

    function makeChessMove(fromR, fromC, toR, toC) {
        const piece = board[fromR][fromC];
        const target = board[toR][toC];

        if (target === "wk" || target === "bk") {
            gameOver = true;
            if (target === "wk") {
                addComputerPoint();
                setStatus("Black captured the White king. Black wins!");
            } else {
                addPlayerPoint();
                setStatus("White captured the Black king. White wins!");
            }
        }

        if (target && target !== "wk" && target !== "bk") {
            if (colorOf(piece) === "w") capturedWhite.push(target);
            else capturedBlack.push(target);
        }

        board[toR][toC] = piece;
        board[fromR][fromC] = "";
        selected = null;
        legalMoves = [];

        const reachedPromotion = typeOf(piece) === "p" && ((colorOf(piece) === "w" && toR === 0) || (colorOf(piece) === "b" && toR === 7));
        if (reachedPromotion) {
            promotionTarget = { r: toR, c: toC, color: colorOf(piece) };
            showPromotion();
            drawChess();
            return;
        }

        if (!gameOver) switchTurn();
        drawChess();
    }

    function switchTurn() {
        turn = turn === "w" ? "b" : "w";
        const check = isKingInCheck(turn);
        if (check) setStatus(`${turn === "w" ? "White" : "Black"} king is in check.`);
        else setStatus(`${turn === "w" ? "White" : "Black"} to move.`);
        if (mode === "ai" && turn === "b" && !gameOver) setTimeout(computerChessMove, 500);
    }

    function showPromotion() {
        promotionBox.classList.add("show");
        setStatus("Pawn promotion. Choose a piece.");
    }

    promotionBox.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            if (!promotionTarget) return;
            const promoteTo = btn.dataset.promote;
            board[promotionTarget.r][promotionTarget.c] = promotionTarget.color + promoteTo;
            promotionTarget = null;
            promotionBox.classList.remove("show");
            switchTurn();
            drawChess();
        });
    });

    function computerChessMove() {
        if (turn !== "b" || gameOver || promotionTarget) return;
        const allMoves = [];

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (colorOf(board[r][c]) === "b") {
                    getMoves(r, c).forEach(m => allMoves.push({ fromR: r, fromC: c, toR: m.r, toC: m.c, capture: m.capture }));
                }
            }
        }

        if (!allMoves.length) {
            setStatus("Black has no available moves.");
            return;
        }

        const captures = allMoves.filter(m => m.capture);
        const move = captures.length ? captures[Math.floor(Math.random() * captures.length)] : allMoves[Math.floor(Math.random() * allMoves.length)];
        makeChessMove(move.fromR, move.fromC, move.toR, move.toC);
    }

    drawChess();
}

renderGame();
