import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';


const ColorGame = () => {
  const [gridSize, setGridSize] = useState(2);
  const [correctCount, setCorrectCount] = useState(0);
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [answerTile, setAnswerTile] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [stage, setStage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);

  const generateTiles = (size) => {
    const baseColor = getRandomColor();
    const tilesArray = Array(size * size).fill(baseColor);
    const randomIndex = Math.floor(Math.random() * tilesArray.length);
    tilesArray[randomIndex] = getSlightlyDifferentColor(baseColor);
    setTiles(tilesArray);
    setAnswerTile(randomIndex);
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // タイル色ランダム生成
  const getSlightlyDifferentColor = (baseColor) => {
    const colorParts = baseColor.match(/\d+/g).map(Number);
    const newColorParts = colorParts.map((part) =>
      Math.max(0, Math.min(255, part + Math.floor(Math.random() * 40 - 20)))
    );
    return `rgb(${newColorParts.join(", ")})`;
  };

  // タイルクリック
  const handleTileClick = (index) => {
    // GAME_OVERの場合
    if (isGameOver) return;

    if (index === answerTile) {
      setCorrectCount(correctCount + 1);
      setScore(score + Math.floor(timer * 10));
      setTimer(15);

      // 3回当てたらタイル数変更
      if (correctCount + 1 === 3) {
        setGridSize(gridSize + 1);
        setStage(stage + 1);
        setCorrectCount(0);
      }
      generateTiles(gridSize);
    } else {
      // 正解以外をクリクするさい
      setTimer((prevTimer) => Math.max(prevTimer - 1, 0));
    }
  };

  useEffect(() => {
    if (isGameOver) return;

    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        clearInterval(countdown);
        setIsGameOver(true);
        setShowAlert(true);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, isGameOver]);

  useEffect(() => {
    generateTiles(gridSize);
  }, [gridSize]);

  // 結果ポップアップ
  useEffect(() => {
    if (showAlert) {
      alert(`Game Over!\nStage: ${stage}\nScore: ${score}`);
    }
  }, [showAlert]);

  // ReStartボタン
  const restartGame = () => {
    setGridSize(2);
    setCorrectCount(0);
    setTimer(15);
    setScore(0);
    setIsGameOver(false);
    setStage(1);
    setShowAlert(false);
    generateTiles(2);

    document.getElementById('timer-value').innerText = '15';
    document.getElementById('score-value').innerText = '0';
    document.getElementById('stage-value').innerText = '1';
  };

  useEffect(() => {
    document.getElementById('timer-value').innerText = timer;
    document.getElementById('score-value').innerText = score;
    document.getElementById('stage-value').innerText = stage;
  }, [timer, score, stage]);

  return (
    <div className="container"> {}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {tiles.map((color, index) => (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            className="tile"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<ColorGame />, document.getElementById("root"));
