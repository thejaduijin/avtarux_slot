import { useEffect, useState } from 'react';
import './App.css';
import { Stage, Container, Sprite } from '@pixi/react';
import { Assets } from 'pixi.js';
import PayTableComponent from './components/PayTableComponent';

function App() {
  const [reels, setReels] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [winAmount, setWinAmount] = useState(0);
  const [dataSymbols, setDataSymbols] = useState([]);
  const [open, setOpen] = useState(false);

  const BET_AMOUNT = 5;
  const ROWS = 3;
  const COLS = 5;
  const SYMBOL_SIZE = 160; // Size of each symbol in pixels

  async function loadAssets() {
    await Assets.init({ manifest: "/manifest.json" });
    let textures = await Assets.loadBundle("symbols");
    setDataSymbols(Object.values(textures));
  }

  const initializeReels = () => {
    if (dataSymbols.length === 0) return; // checking dataSymbols is loaded or not
    const newReels = Array(ROWS).fill(null).map(() =>
      Array(COLS).fill(null).map(() => dataSymbols[Math.floor(Math.random() * dataSymbols.length)])
    );
    setReels(newReels);
  };


  useEffect(() => {
    loadAssets();
  }, []);


  useEffect(() => {
    if (dataSymbols.length > 0) {
      initializeReels();
    }
  }, [dataSymbols]);


  const spin = () => {
    if (spinning || balance < BET_AMOUNT || dataSymbols.length === 0) return;
    setSpinning(true);
    setBalance(prev => prev - BET_AMOUNT);
    setWinAmount(0);

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


  const checkWinLines = (reels) => {
    let totalWin = 0;
    const ROWS = reels.length;
    const COLS = reels[0].length;

    console.log(reels, "reels");

    // Check Row Wins
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
        totalWin += count * 5;
      }
    }

    // Check Diagonal Wins (Top-Left to Bottom-Right)
    let firstSymbol = reels[0][0];
    let count = 1;
    for (let i = 1; i < Math.min(ROWS, COLS); i++) {
      if (reels[i][i] === firstSymbol) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 3) {
      totalWin += count * 5;
    }

    // Check Diagonal Wins (Bottom-Left to Top-Right)
    firstSymbol = reels[ROWS - 1][0];
    count = 1;
    for (let i = 1; i < Math.min(ROWS, COLS); i++) {
      if (reels[ROWS - 1 - i][i] === firstSymbol) {
        count++;
      } else {
        break;
      }
    }
    if (count >= 3) {
      totalWin += count * 5;
    }

    // Check Three-row Continuous Symbol Wins
    for (let col = 0; col < COLS; col++) {
      if (reels[0][col] === reels[1][col] && reels[1][col] === reels[2][col]) {
        totalWin += 5;
      }
    }

    return totalWin;
  };

  function showPayTable() {
    setOpen(true)
  }

  return (
    <>
      <div className="max-h-screen bg-gray-900 flex items-center justify-center ">
        <div className="bg-gray-800 rounded-xl shadow-2xl">

          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Avtar Slots</h1>
          </div>
          <Stage width={800} height={500} >
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
            {open && (
              <PayTableComponent spinning={spinning} setOpen={setOpen}></PayTableComponent>
            )}
          </Stage>
          <div className="flex justify-between text-lg text-white ">
            <span>Balance: ${balance}</span>
            <span>Bet: ${BET_AMOUNT}</span>
            <span>Win: ${winAmount}</span>
          </div>
          <div className="flex justify-between">
            <button
              onClick={showPayTable}
              disabled={spinning || open}
              className={`w-96 py-4 rounded-lg text-xl font-bold transition-all
            ${spinning || open
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-slate-500 hover:bg-slate-600 text-white'
                }`
              }
            >
              PAYTABLE
            </button>

            <button
              onClick={spin}
              disabled={spinning || balance < BET_AMOUNT || open}
              className={`h-16 w-16 p-24 rounded-lg text-xl font-bold transition-all
            ${spinning || balance < BET_AMOUNT
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-slate-500 hover:bg-slate-600 text-white'
                }`
              }
            >
              {spinning ? 'Spinning...' : 'SPIN'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;