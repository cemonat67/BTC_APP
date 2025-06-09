import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const coins = ["bitcoin", "ethereum", "avalanche-2", "chainlink", "tether"];
const coinNames = {
  bitcoin: "BTC",
  ethereum: "ETH",
  "avalanche-2": "AVAX",
  chainlink: "LINK",
  tether: "USDT"
};

function App() {
  const [prices, setPrices] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(",")}&vs_currencies=try`);
    const data = await res.json();
    setPrices(data);
    setHistory(prev => [
      ...prev.slice(-9),
      {
        time: new Date().toLocaleTimeString(),
        ...Object.fromEntries(coins.map(coin => [coinNames[coin], data[coin]?.try || 0]))
      }
    ]);
  };

  return (
    <div className="p-4 font-mono">
      <h1 className="text-2xl font-bold mb-4">📊 Cem’in Kripto Takip Paneli</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {coins.map((coin) => (
          <div key={coin} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold">{coinNames[coin]}</h2>
            <p className="text-2xl">₺{prices[coin]?.try.toLocaleString("tr-TR") || "..."}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Fiyat Hareketleri (Son 10 veri)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="time" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            {Object.values(coinNames).map((key) => (
              <Line key={key} type="monotone" dataKey={key} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
