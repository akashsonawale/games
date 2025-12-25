import { useState, useRef } from "react";
import "./App.css";
import Footer from "./components/Spin the wheel/footer";

const NUMBERS = Array.from({ length: 31 }, (_, i) => i + 1);
const BET = 100;
const SLICE = 360 / 31;

// rows for table
const ROWS = [
  NUMBERS.slice(0, 8),
  NUMBERS.slice(8, 16),
  NUMBERS.slice(16, 24),
  NUMBERS.slice(24, 31),
];

export default function App() {
  const [balance, setBalance] = useState(300000);
  const [selected, setSelected] = useState([]);
  const [popupNumber, setPopupNumber] = useState(null);
  const [message, setMessage] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);

  const arrowRef = useRef(null);
  const currentAngleRef = useRef(0);

  // single number bet
  const toggleNumber = (num) => {
    if (isSpinning) return;

    if (selected.includes(num)) {
      setSelected(selected.filter(n => n !== num));
      setBalance(balance + BET);
    } else {
      if (balance < BET) return alert("Low balance");
      setSelected([...selected, num]);
      setBalance(balance - BET);
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
        cost += BET;
      }
    });

    if (balance < cost) return alert("Not enough balance");

    setSelected(updated);
    setBalance(balance - cost);
  };

  // SPIN ARROW (PERFECT & STABLE)
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

    // 3️⃣ force reflow
    // eslint-disable-next-line no-unused-expressions
    arrow.offsetHeight;

    // 4️⃣ spin
    const targetAngleMod = targetAngle % 360;
    const delta = (targetAngleMod - baseAngle + 360) % 360;
    const finalAngle = baseAngle + 360 * 5 + delta;
    arrow.style.transition = "transform 3s ease-out";
    arrow.style.transform = `rotate(${finalAngle}deg)`;

    currentAngleRef.current = finalAngle;
  
    setTimeout(() => {
      setPopupNumber(winNumber);

      if (selected.includes(winNumber)) {
        setBalance(prev => prev + BET * 10);
        setMessage(`🎉 WON ₹${BET * 10}`);
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

      <Footer />
    </div>
  );
}

