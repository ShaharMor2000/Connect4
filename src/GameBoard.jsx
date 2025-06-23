import React from 'react'

const ROWS = 6;
const COLS = 7;
const COLORS = ["red", "yellow","pink","green","blue","purple", "orange"];
class GameBoard extends React.Component {
    state = {
        board: Array.from({length: ROWS}, () => Array(COLS).fill(null)),
        playerTurn: 1,
        gameOver: false,
        color1:"",
        color2:"",
        started: false

    }

    handleCulomClick = (colIndex) => {
        const newBoard = this.state.board.map(row => [...row]);
        for (let row = ROWS - 1; row >= 0; row--) {
            if (newBoard[row][colIndex] === null) {
                newBoard[row][colIndex] = this.state.playerTurn;
                if (this.checkWinner(newBoard)) {
                    this.setState({
                        board: newBoard,
                        gameOver: true
                    })
                } else {
                    this.setState({
                        board: newBoard,
                        playerTurn: this.state.playerTurn === 1 ? 2 : 1
                    })
                }


                break;
            }
        }
    }

    checkWinner(board) {
        for(let row=0; row<ROWS; row++){
            for(let col=0; col<COLS-3; col++){
                if(
                board[row][col] === this.state.playerTurn &&
                    board[row][col+1] === this.state.playerTurn &&
                    board[row][col +2] === this.state.playerTurn &&
                    board[row][col+3 ] === this.state.playerTurn
                )
                    return true;
            }
        }
        for(let col=0; col<COLS; col++){
            for(let row=0; row<ROWS - 3; row++){
                if(
                    board[row][col] === this.state.playerTurn &&
                    board[row+1][col] === this.state.playerTurn &&
                    board[row+2][col] === this.state.playerTurn &&
                    board[row+3][col] === this.state.playerTurn
                )
                    return true;

            }
        }
        for(let row=0; row<ROWS-3; row++){
            for(let col=0; col<COLS-3; col++){
                if(
                    board[row][col] === this.state.playerTurn &&
                    board[row+1][col+1] === this.state.playerTurn &&
                    board[row+2][col+2] === this.state.playerTurn &&
                    board[row+3][col+3] === this.state.playerTurn
                )
                    return true;
            }
        }
        for(let row=0; row<ROWS-3; row++){
            for(let col=COLS-3; col>=0; col--){
                if(
                    board[row][col] === this.state.playerTurn &&
                    board[row+1][col-1] === this.state.playerTurn &&
                    board[row+2][col-2] === this.state.playerTurn &&
                    board[row+3][col-3] === this.state.playerTurn
                )
                    return true;
            }
        }

    }
    handleColorChange =(player, color)=>{
            if(player === 1){
                this.setState({ color1: color})
            }
            else{
                this.setState({ color2: color})
            }
    }
    startGame =()=>{
        if(this.state.color1 && this.state.color2 &&this.state.color1 !== this.state.color2){
            this.setState({ started: true})
        }
        else {
            alert("you must too choose colors");
        }
    }
    render() {
        if(!this.state.started){
            return (
                <diV>
                    <h1> Choose your colors</h1>
                    <div>
                        <label> Player 1 : </label>
                        <select value={this.state.color1} onChange={(e)=>this.handleColorChange(1, e.target.value)}>
                            <option value=""> select color</option>
                            {COLORS.filter((c) => c!== this.state.color2).map((color)=>(
                            <option>{color}</option>
                            ))}
                        </select>
                        <label> Player 2 : </label>
                        <select value={this.state.color2} onChange={(e)=>this.handleColorChange(2, e.target.value)}>
                            <option value=""> select color</option>
                            {COLORS.filter((c) => c!== this.state.color1).map((color)=>(
                                <option>{color}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={this.startGame}> Start Game </button>
                </diV>
            )
        }
        return (

            <div>
                {this.state.gameOver ? <div> game over player {this.state.playerTurn} win`s </div> :
                    <div>
                        <h1>player {this.state.playerTurn} turn</h1>
                        {Array.from({length: COLS}).map((_, colsIndex) => (
                            <button onClick={() => this.handleCulomClick(colsIndex)}>
                                ↓
                            </button>
                        ))}
                        <div style={{display: "grid", gridTemplateColumns: `repeat(${COLS},50px`}}>
                            {Array.from({length: ROWS}).map((_, rowsIndex) => {
                                return Array.from({length: COLS}).map((_, colsIndex) => {
                                        const newBoard = this.state.board[rowsIndex][colsIndex];
                                        return (

                                            <button
                                                style={{backgroundColor: newBoard === 1 ? this.state.color1 : newBoard === 2 ? this.state.color2: "white"}}>
                                                x
                                            </button>
                                        );
                                    }
                                )

                            })}
                        </div>
                    </div>
                }
            </div>

        )
    }
}

export default GameBoard;