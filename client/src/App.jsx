import CheckBalance from "./CheckBalance";
import MyWallet from "./MyWallet";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  
  return (
    <div className="app">
      <CheckBalance
        address={address}
        setAddress={setAddress}
        balance={balance}
        setBalance={setBalance}
      />
      <MyWallet 
        checkedBalanceAddress={address}
        checkedBalance={balance}
        setCheckedBalance={setBalance}
      />
    </div>
  );
}

export default App;
