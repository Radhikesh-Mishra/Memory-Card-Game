import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [array, setArray] = useState([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]);
  const [clickedIndices, setClickedIndices] = useState([]);
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const shuffleArray = () => {
      const cloned = [...array];
      for (let i = cloned.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
      }
      setArray(cloned);
    };

    shuffleArray();
  }, []);

  useEffect(() => {
    let interval = null;
    if (!gameOver) {
      interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (hiddenIndices.length === array.length) {
      setGameOver(true);
    }
  }, [hiddenIndices, array.length]);

  const handleClick = (index) => {
    if (clickedIndices.includes(index) || hiddenIndices.includes(index)) return;
  
    const newClicked = [...clickedIndices, index];
    setClickedIndices(newClicked);
  
    if (newClicked.length === 2) {
      const [i1, i2] = newClicked;
  
      if (array[i1] === array[i2]) {
        // If matched, hide them
        setTimeout(() => {
          setHiddenIndices((prev) => [...prev, i1, i2]);
          setClickedIndices([]);
        }, 600);
      } else {
        // If not matched, flip them back
        setTimeout(() => {
          setClickedIndices([]);
        }, 1000);
      }
    }
  
    if (newClicked.length > 2) {
      // Just in case user clicks rapidly
      setClickedIndices([index]);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="AppContainer">
      <h1>Memory Card Game</h1>
      
      <div className="App">
        {array.map((val, i) => {
          const isHidden = hiddenIndices.includes(i);
          const isFlipped = clickedIndices.includes(i);
          const className = isHidden ? 'hide' : isFlipped ? 'card' : 'flip';

          return (
            <div key={i} className={className} onClick={() => handleClick(i)}>
              {val}
            </div>
          );
        })}
      </div>
      <h3>Time: {formatTime(seconds)}</h3>
      {gameOver && <h3>🎉 All cards matched in {formatTime(seconds)}!</h3>
      }
      <button onClick={() => window.location.reload()}>Restart</button>
    </div>
  );
}

export default App;
