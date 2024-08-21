// script.js
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, setMark };
})();

const Player = (name, mark) => {
    return { name, mark };
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.setResult("");
    };

    const playRound = (index) => {
        if (gameOver) return;
        if (Gameboard.setMark(index, players[currentPlayerIndex].mark)) {
            if (checkWin()) {
                DisplayController.setResult(`${players[currentPlayerIndex].name} wins!`);
                gameOver = true;
            } else if (Gameboard.getBoard().every(cell => cell !== "")) {
                DisplayController.setResult("It's a tie!");
                gameOver = true;
            } else {
                currentPlayerIndex = 1 - currentPlayerIndex;
            }
            DisplayController.renderBoard();
        }
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    };

    return { startGame, playRound };
})();

const DisplayController = (() => {
    const gameboardDiv = document.getElementById("gameboard");
    const resultDiv = document.getElementById("result");

    const renderBoard = () => {
        gameboardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.textContent = mark;
            cell.addEventListener("click", () => GameController.playRound(index));
            gameboardDiv.appendChild(cell);
        });
    };

    const setResult = (message) => {
        resultDiv.textContent = message;
    };

    return { renderBoard, setResult };
})();

document.getElementById("start-button").addEventListener("click", () => {
    const player1Name = document.getElementById("player1").value;
    const player2Name = document.getElementById("player2").value;
    GameController.startGame(player1Name, player2Name);
});

document.getElementById("restart-button").addEventListener("click", () => {
    GameController.startGame(
        document.getElementById("player1").value,
        document.getElementById("player2").value
    );
});