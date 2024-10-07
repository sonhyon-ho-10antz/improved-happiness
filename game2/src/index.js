import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onClick }) {
  return (
    <div>
      {squares.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((square, colIndex) => (
            <Square key={colIndex} value={square} onClick={() => onClick(rowIndex, colIndex)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function checkWinner(squares, row, col, currentPlayer) {
  const directions = [
    [1, 0],  // 縦
    [0, 1],  // 横
    [1, 1],  // 斜め
    [1, -1], // 逆斜め
  ];

  const size = squares.length;

  for (let [dx, dy] of directions) {
    let count = 1;

    for (let i = 1; i < 5; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && squares[newRow][newCol] === currentPlayer) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && squares[newRow][newCol] === currentPlayer) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 5) {
      return true;
    }
  }
  return false;
}

function Game() {
  // サイズ調整
  const initialSquares = Array(16).fill(null).map(() => Array(16).fill(null));
  const [squares, setSquares] = useState(initialSquares);
  const [isBlackNext, setIsBlackNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleClick = (row, col) => {
    if (squares[row][col] || winner) return;
    
    //　駒設定
    const currentPlayer = isBlackNext ? "⚫️" : "⚪️";
    const newSquares = squares.map((r, rowIndex) =>
      r.map((square, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return currentPlayer;
        }
        return square;
      })
    );

    setSquares(newSquares);
    
    if (checkWinner(newSquares, row, col, currentPlayer)) {
      setWinner(currentPlayer);
    } else {
      setIsBlackNext(!isBlackNext);
    }
  };

  const handleReset = () => {
    setSquares(initialSquares); 
    setIsBlackNext(true);
    setWinner(null);
  };

  return (
    <div className="game">
      <h1>5目並べ</h1>
      {winner ? <h2>{winner} Wins!</h2> : <h2>Next player: {isBlackNext ? "黒" : "白"}</h2>}
      <Board squares={squares} onClick={handleClick} />
      <br></br>
      <button className="reset-button" onClick={handleReset}>Reset Game</button>
      <br></br>
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));
