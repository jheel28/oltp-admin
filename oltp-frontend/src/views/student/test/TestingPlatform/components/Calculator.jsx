import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [expr, setExpr] = useState("");

  const input = (d) => {
    if (waiting) { setDisplay(String(d)); setWaiting(false); }
    else setDisplay(display === "0" ? String(d) : display + d);
  };
  const decimal = () => {
    if (waiting) { setDisplay("0."); setWaiting(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  };
  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setWaiting(false); setExpr(""); };
  const sign = () => setDisplay(String(parseFloat(display) * -1));
  const pct = () => setDisplay(String(parseFloat(display) / 100));
  const compute = (a, b, o) => {
    switch (o) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : "ERR";
      default: return b;
    }
  };
  const handleOp = (o) => {
    const cur = parseFloat(display);
    if (prev !== null && !waiting) {
      const r = compute(prev, cur, op);
      const rounded = typeof r === "number" ? parseFloat(r.toFixed(10)) : r;
      setDisplay(String(rounded));
      setPrev(typeof rounded === "number" ? rounded : 0);
      setExpr(`${rounded} ${o}`);
    } else {
      setPrev(cur);
      setExpr(`${cur} ${o}`);
    }
    setOp(o); setWaiting(true);
  };
  const equals = () => {
    if (prev === null || op === null) return;
    const r = compute(prev, parseFloat(display), op);
    const rounded = typeof r === "number" ? parseFloat(r.toFixed(10)) : r;
    setExpr(`${prev} ${op} ${parseFloat(display)} =`);
    setDisplay(String(rounded));
    setPrev(null); setOp(null); setWaiting(true);
  };

  const Btn = ({ label, onClick, cls = "" }) => (
    <button
      onClick={onClick}
      className={`rounded-xl py-3 text-sm font-bold transition-all active:scale-95 select-none ${cls || "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed bottom-28 right-4 z-50 w-60 select-none overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between bg-[#1a2744] px-4 py-2.5">
        <span className="text-xs font-bold uppercase tracking-widest text-white">Calculator</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition">
          <AiOutlineClose />
        </button>
      </div>
      <div className="bg-gray-900 px-4 py-3 text-right">
        <div className="h-4 truncate text-[10px] text-gray-500">{expr}</div>
        <div className="truncate text-2xl font-black tracking-tight text-white">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-1.5 p-2.5">
        <Btn label="C" onClick={clear} cls="bg-red-100 text-red-700 hover:bg-red-200" />
        <Btn label="+/−" onClick={sign} cls="bg-gray-200 text-gray-700 hover:bg-gray-300" />
        <Btn label="%" onClick={pct} cls="bg-gray-200 text-gray-700 hover:bg-gray-300" />
        <Btn label="÷" onClick={() => handleOp("÷")} cls="bg-amber-500 text-white hover:bg-amber-600" />
        {["7","8","9"].map((n) => <Btn key={n} label={n} onClick={() => input(n)} />)}
        <Btn label="×" onClick={() => handleOp("×")} cls="bg-amber-500 text-white hover:bg-amber-600" />
        {["4","5","6"].map((n) => <Btn key={n} label={n} onClick={() => input(n)} />)}
        <Btn label="−" onClick={() => handleOp("−")} cls="bg-amber-500 text-white hover:bg-amber-600" />
        {["1","2","3"].map((n) => <Btn key={n} label={n} onClick={() => input(n)} />)}
        <Btn label="+" onClick={() => handleOp("+")} cls="bg-amber-500 text-white hover:bg-amber-600" />
        <button onClick={() => input("0")}
          className="col-span-2 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-800 hover:bg-gray-200 active:scale-95">0</button>
        <Btn label="." onClick={decimal} />
        <Btn label="=" onClick={equals} cls="bg-green-500 text-white hover:bg-green-600" />
      </div>
    </div>
  );
};

export default Calculator;