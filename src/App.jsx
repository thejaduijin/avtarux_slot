import { useEffect, useState } from 'react';
import './App.css';
import { Stage, Container, Sprite, Text } from '@pixi/react';
import { Application, Assets } from 'pixi.js';
import PayTable from './components/Paytable';

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
    <>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center ">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Avtar Slots</h1>
            <div className="flex justify-between  text-lg text-white ">
              <span>Balance: ${balance}</span>
              <span>Bet: ${BET_AMOUNT}</span>
              <span>Win: ${winAmount}</span>
            </div>
          </div>
          {/* <PayTable></PayTable> */}
          <Stage width={800} height={500} options={{ backgroundColor: "transparent" }}>
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
            {/* <Text
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
            /> */}
          </Stage>

          <button
            onClick={spin}
            disabled={spinning || balance < BET_AMOUNT}
            className={`w-full py-4 rounded-lg text-xl font-bold transition-all
            ${spinning || balance < BET_AMOUNT
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
          >
            {spinning ? 'Spinning...' : 'SPIN'}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;