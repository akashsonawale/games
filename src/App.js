import { useState, useRef } from "react";
import "./App.css";
import Footer from "./components/Spin the wheel/footer";

const NUMBERS = Array.from({ length: 31 }, (_, i) => i + 1);
const SLICE = 360 / 31;
const CHIPS = [100, 500, 1000, 10000, 100000];

// rows for table
const ROWS = [
  NUMBERS.slice(0, 8),
  NUMBERS.slice(8, 16),
  NUMBERS.slice(16, 24),
  NUMBERS.slice(24, 31),
];

export default function App() {
  const [balance, setBalance] = useState(100000);
  const [betAmount, setBetAmount] = useState(100);
  const [selected, setSelected] = useState([]);
  const [popupNumber, setPopupNumber] = useState(null);
  const [message, setMessage] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const arrowRef = useRef(null);
  const currentAngleRef = useRef(0);

  // single number bet
  const toggleNumber = (num) => {
    if (isSpinning) return;

    if (selected.includes(num)) {
      setSelected(selected.filter(n => n !== num));
      setBalance(balance + betAmount);
    } else {
      if (balance < betAmount) return alert("Low balance");
      setSelected([...selected, num]);
      setBalance(balance - betAmount);
    }
  };

  // FULL BET per row
  const fullBetRow = (row) => {
    if (isSpinning) return;

    let cost = 0;
    let updated = [...selected];

    row.forEach(num => {
      if (!updated.includes(num)) {
        updated.push(num);
        cost += betAmount;
      }
    });

    if (balance < cost) return alert("Not enough balance");

    setSelected(updated);
    setBalance(balance - cost);
  };

  const spin = () => {
    if (isSpinning) return;
    if (selected.length === 0) {
      alert("Place a bet first");
      return;
    }

    setIsSpinning(true);
    setPopupNumber(null);
    setMessage("");

    const winNumber = Math.floor(Math.random() * 31) + 1;

    // correct target angle (top = 270°)
    const targetAngle = (winNumber * SLICE) % 360;

    const arrow = arrowRef.current;
    if (!arrow) return;

    // 1️⃣ remove transition
    arrow.style.transition = "none";

    // 2️⃣ reset base angle
    const baseAngle = currentAngleRef.current % 360;
    arrow.style.transform = `rotate(${baseAngle}deg)`;

    // eslint-disable-next-line no-unused-expressions
    arrow.offsetHeight;

    const targetAngleMod = targetAngle % 360;
    const delta = (targetAngleMod - baseAngle + 360) % 360;
    const finalAngle = baseAngle + 360 * 5 + delta;
    arrow.style.transition = "transform 3s ease-out";
    arrow.style.transform = `rotate(${finalAngle}deg)`;

    currentAngleRef.current = finalAngle;
  
    setTimeout(() => {
      setPopupNumber(winNumber);

      if (selected.includes(winNumber)) {
        const totalBet = selected.length * betAmount;
        const multiplier = selected.length === 1 ? 36 : 3;
        const totalWin = totalBet * multiplier;
        setBalance(prev => prev + totalWin);
        setMessage(`🎉 WON ₹${totalWin}`);
      } else {
        setMessage("❌ LOST");
      }

      setSelected([]);
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <div className="app">
      <h1>🎡 खुशी मर्जीचा खेळ</h1>
      <h2>Balance: ₹{balance}</h2>
      <button className="rules-btn" onClick={() => setShowRules(!showRules)}>
        {showRules ? "Hide Rules" : "Show Rules"}
      </button>

      {/* Wheel */}
      <div className="wheel-wrapper">
        {/* Arrow */}
        <div ref={arrowRef} className="arrow" />

        {/* Result popup */}
        {popupNumber && <div className="popup">{popupNumber}</div>}

        {/* Static wheel */}
        <div className="wheel">
          {NUMBERS.map((num, i) => (
            <div
              key={num}
              className="wheel-number"
              style={{ transform: `rotate(${270 + i * SLICE}deg)` }}
            >
              <span>{num}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ONE SPIN BUTTON */}
      <button className="spin-btn" onClick={spin} disabled={isSpinning}>
        {isSpinning ? "SPINNING..." : "SPIN"}
      </button>

      {/* Bet Amount */}
      <div className="bet-amount">
        <h3>Bet Amount: ₹{betAmount}</h3>
        <div className="chips">
          {CHIPS.map(chip => (
            <button
              key={chip}
              className={`chip ${betAmount === chip ? 'active' : ''}`}
              onClick={() => setBetAmount(chip)}
            >
              ₹{chip}
            </button>
          ))}
        </div>
      </div>

      {/* Betting Table */}
      <div className="table">
        {ROWS.map((row, i) => (
          <div key={i} className="row">
            {row.map(num => (
              <div
                key={num}
                className={`cell ${selected.includes(num) ? "active" : ""}`}
                onClick={() => toggleNumber(num)}
              >
                {num}
              </div>
            ))}
            <button className="full-btn" onClick={() => fullBetRow(row)}>
              FULL BET
            </button>
          </div>
        ))}
      </div>

      <p className="msg">{message}</p>

      {/* Game Rules */}
      {showRules && (
        <div className="rules">
          <h4>Game Rules</h4>
          <ul>
            <li>Bet on single numbers or full rows.</li>
            <li>Single number win: 36x your bet.</li>
            <li>Row win: 3x your total bet.</li>
            <li>Spin the wheel to play!</li>
          </ul>
          <button className="close-btn" onClick={() => setShowRules(false)}>Close</button>
        </div>
      )}

      <Footer />
    </div>
  );
}

