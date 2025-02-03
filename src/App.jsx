import { useEffect, useState } from 'react';
import './App.css';
import { Stage, Container, Sprite, Text } from '@pixi/react';
import { Application, Assets } from 'pixi.js';

function App() {
  const [reels, setReels] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);
  const [dataSymbols, setDataSymbols] = useState([]);

  const BET_AMOUNT = 10;
  const ROWS = 3;
  const COLS = 5;
  const SYMBOL_SIZE = 120; // Size of each symbol in pixels

  async function loadAssets() {
    await Assets.init({ manifest: "/manifest.json" });
    let textures = await Assets.loadBundle("symbols");
    setDataSymbols(Object.values(textures));
  }

  const initializeReels = () => {
    if (dataSymbols.length === 0) return; // Ensure dataSymbols is loaded
    const newReels = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => dataSymbols[Math.floor(Math.random() * dataSymbols.length)])
    );
    setReels(newReels);
  };


  useEffect(() => {
    const app = new Application({
      resizeTo: window,
    });
    app.view.style.position = "absolute";

    loadAssets();
  }, []);


  useEffect(() => {
    if (dataSymbols.length > 0) {
      initializeReels(); // Initialize reels after dataSymbols is loaded
    }
  }, [dataSymbols]); // Re-run when dataSymbols changes

  const checkWinLines = (reels) => {
    let totalWin = 0;

    // Check each row
    for (let row = 0; row < ROWS; row++) {
      const firstSymbol = reels[row][0];
      let count = 1;

      for (let col = 1; col < COLS; col++) {
        if (reels[row][col] === firstSymbol) {
          count++;
        } else {
          break;
        }
      }

      if (count >= 3) {
        totalWin += count * 5; // Win amount increases with more matching symbols
      }
    }

    return totalWin;
  };

  const spin = () => {
    if (spinning || balance < BET_AMOUNT || dataSymbols.length === 0) return; // Ensure dataSymbols is loaded

    setSpinning(true);
    setBalance(prev => prev - BET_AMOUNT);
    setWinAmount(0);

    // Animate spins
    const spinDuration = 2000;
    const spinInterval = 100;
    const iterations = spinDuration / spinInterval;
    let currentIteration = 0;

    const spinInterval_id = setInterval(() => {
      if (currentIteration < iterations) {
        initializeReels();
        currentIteration++;
      } else {
        clearInterval(spinInterval_id);
        setSpinning(false);

        // Calculate and set wins
        const finalReels = Array(ROWS).fill(null).map(() =>
          Array(COLS).fill(null).map(() => dataSymbols[Math.floor(Math.random() * dataSymbols.length)])
        );
        setReels(finalReels);

        const win = checkWinLines(finalReels);
        setWinAmount(win);
        setBalance(prev => prev + win);
      }
    }, spinInterval);
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Container>
        {reels.map((row, rowIndex) =>
          row.map((symbol, colIndex) => (
            <Sprite
              key={`${rowIndex}-${colIndex}`}
              texture={symbol}
              x={colIndex * SYMBOL_SIZE}
              y={rowIndex * SYMBOL_SIZE}
              width={SYMBOL_SIZE}
              height={SYMBOL_SIZE}
            />
          ))
        )}
      </Container>
      <Text
        text={`Balance: $${balance}`}
        x={10}
        y={window.innerHeight - 200}
        style={{ fill: 'white', fontSize: 24 }}
      />
      <Text
        text={`Win: $${winAmount}`}
        x={10}
        y={window.innerHeight - 150}
        style={{ fill: 'white', fontSize: 24 }}
      />
      <Text
        text="Spin"
        x={300}
        y={window.innerHeight - 150}
        style={{ fill: 'white', fontSize: 24 }}
        interactive={true}
        cursor='pointer'
        pointerdown={spin}
      />
    </Stage>
  );
}

export default App;