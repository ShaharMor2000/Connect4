import React from 'react'
import './GameBoard.css';

const ROWS = 6;
const COLS = 7;
const COLORS = ["red", "yellow", "pink", "green", "blue", "purple", "orange"];

class GameBoard extends React.Component {
    state = {
        board: Array.from({length: ROWS}, () => Array(COLS).fill(null)),
        playerTurn: 1,
        gameOver: false,
        color1: "",
        color2: "",
        started: false,
        winner: null,
        countdown: 10
    }
    turnTimeout = null;
    countdownInterval = null;

    // Start a 10-second timer for each player's turn
    startTurnTimer = () => {
        if (this.turnTimeout) clearTimeout(this.turnTimeout);
        if (this.countdownInterval) clearInterval(this.countdownInterval);

        this.setState({countdown: 10});

        this.countdownInterval = setInterval(() => {
            this.setState(prev => {
                if (prev.countdown === 1) {
                    clearInterval(this.countdownInterval);
                    return {countdown: 0};
                }
                return {countdown: prev.countdown - 1};
            });
        }, 1000);

        this.turnTimeout = setTimeout(() => {
            this.setState(prev => ({
                playerTurn: prev.playerTurn === 1 ? 2 : 1,
                countdown: 10
            }), () => {
                this.startTurnTimer();
            });
        }, 10000);
    };

    handleCulomClick = (colIndex) => {
        if (this.state.gameOver) return;
        const newBoard = this.state.board.map(row => [...row]);
        for (let row = ROWS - 1; row >= 0; row--) {
            if (newBoard[row][colIndex] === null) {
                newBoard[row][colIndex] = this.state.playerTurn;

                const hasWinner = this.checkWinner(newBoard);
                const isFull = newBoard.every(row => row.every(cell => cell !== null));

                this.setState({
                    board: newBoard,
                    gameOver: hasWinner || isFull,
                    winner: hasWinner ? this.state.playerTurn : null
                }, () => {
                    if (hasWinner || isFull) {
                        clearTimeout(this.turnTimeout);
                        clearInterval(this.countdownInterval);
                    } else {
                        this.setState(prev => ({
                            playerTurn: prev.playerTurn === 1 ? 2 : 1
                        }), this.startTurnTimer);
                    }
                });
                break;
            }
        }
    }

    checkWinner(board) {
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                if (
                    board[row][col] === this.state.playerTurn &&
                    board[row][col + 1] === this.state.playerTurn &&
                    board[row][col + 2] === this.state.playerTurn &&
                    board[row][col + 3] === this.state.playerTurn
                )
                    return true;
            }
        }
        for (let col = 0; col < COLS; col++) {
            for (let row = 0; row < ROWS - 3; row++) {
                if (
                    board[row][col] === this.state.playerTurn &&
                    board[row + 1][col] === this.state.playerTurn &&
                    board[row + 2][col] === this.state.playerTurn &&
                    board[row + 3][col] === this.state.playerTurn
                )
                    return true;

            }
        }
        for (let row = 0; row < ROWS - 3; row++) {
            for (let col = 0; col < COLS - 3; col++) {
                if (
                    board[row][col] === this.state.playerTurn &&
                    board[row + 1][col + 1] === this.state.playerTurn &&
                    board[row + 2][col + 2] === this.state.playerTurn &&
                    board[row + 3][col + 3] === this.state.playerTurn
                )
                    return true;
            }
        }
        for (let row = 0; row < ROWS - 3; row++) {
            for (let col = COLS - 3; col >= 0; col--) {
                if (
                    board[row][col] === this.state.playerTurn &&
                    board[row + 1][col - 1] === this.state.playerTurn &&
                    board[row + 2][col - 2] === this.state.playerTurn &&
                    board[row + 3][col - 3] === this.state.playerTurn
                )
                    return true;
            }
        }
    }
    // Player chooses a color before the game starts
    handleColorChange = (player, color) => {
        if (player === 1) {
            this.setState({color1: color})
        } else {
            this.setState({color2: color})
        }
    }
    // Start the game only if both players have selected different colors
    startGame = () => {
        if (this.state.color1 && this.state.color2 && this.state.color1 !== this.state.color2) {
            this.setState({started: true}, this.startTurnTimer);
        } else {
            alert("you must too choose colors");
        }
    }

    render() {
        if (!this.state.started) {
            return (
                <diV className="setup-screen">
                    <h1>🎮 Let's Play Connect 4!</h1>
                    <p>🎨 Choose a different color for each player to start the game</p>
                    <div className="color-select">
                        <div className="player-select">
                            <label> Player 1 : </label>
                            <select value={this.state.color1}
                                    onChange={(e) => this.handleColorChange(1, e.target.value)}>
                                <option value=""> select color</option>
                                {COLORS.filter((c) => c !== this.state.color2).map((color) => (
                                    <option>{color}</option>
                                ))}
                            </select>
                        </div>
                        <div className="player-select">
                            <label> Player 2 : </label>
                            <select value={this.state.color2}
                                    onChange={(e) => this.handleColorChange(2, e.target.value)}>
                                <option value=""> select color</option>
                                {COLORS.filter((c) => c !== this.state.color1).map((color) => (
                                    <option>{color}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        className="start-button"
                        disabled={!this.state.color1 || !this.state.color2 || this.state.color1 === this.state.color2}
                        onClick={this.startGame}> Start Game
                    </button>
                </diV>
            );
        }
        return (
            <div className="game-wrapper">
                {this.state.started && !this.state.gameOver && (
                    <div className="timer-display">
                        ⏱ Time left: {this.state.countdown}
                    </div>
                )}
                <div className="game-container">
                    <h2>player {this.state.playerTurn} turn</h2>
                    <div className="column-buttons">
                        {Array.from({length: COLS}).map((_, colIndex) => (
                            <button key={colIndex} disabled={this.state.gameOver}
                                    onClick={() => this.handleCulomClick(colIndex)}>↓</button>
                        ))}
                    </div>
                    <div className="game-board">
                        {Array.from({length: ROWS}).map((_, rowsIndex) => {
                            return Array.from({length: COLS}).map((_, colsIndex) => {
                                    const newBoard = this.state.board[rowsIndex][colsIndex];
                                    return (
                                        <div
                                            className="cell"
                                            style={{
                                                backgroundColor:
                                                    newBoard === 1
                                                        ? this.state.color1
                                                        : newBoard === 2
                                                            ? this.state.color2
                                                            : "white"
                                            }}
                                        />
                                    );
                                }
                            )

                        })}
                    </div>
                </div>
                {this.state.gameOver && (
                    <div className="game-over-overlay">
                        <div className="game-over-screen">
                            <h2>
                                {this.state.winner
                                    ? `🏆 Player ${this.state.winner} Wins! 🏆`
                                    : "🤝 It's a Draw! 🤝"}
                            </h2>
                            <p>{this.state.winner ? "Congratulations!" : "Well played both players!"}</p>
                            <button className="start-button" onClick={() => window.location.reload()}>
                                🔁 Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

        )
    }
}
export default GameBoard;