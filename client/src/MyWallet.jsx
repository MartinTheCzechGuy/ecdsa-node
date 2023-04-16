import Transfer from "./Transfer";
import { useState } from "react";
import crypto from "./crypto.js";
import server from "./server";

function MyWallet({ checkedBalanceAddress, checkedBalance, setCheckedBalance }) {

    const [balance, setBalance] = useState(0);
    const [wallet, setSelectedWallet] = useState("");
    const [newWalletName, setNewWalletName] = useState("");

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function onSelectWallet(evt) {
        evt.preventDefault();

        const walletName = evt.target.value;
        setSelectedWallet(walletName);
        adjustBalance(walletName);
    }

    async function addWallet(){
        const walletName = newWalletName;

        if (crypto.wallets.has(walletName)) {
            alert("wallet with this name already exists.");
            return
        }

        crypto.addNewWallet(walletName);
        setSelectedWallet(walletName);
        adjustBalance(walletName);
    }

    async function adjustBalance(walletName){
        const address = crypto.getAddress(walletName);
        const { data: { balance }, } = await server.get(`balance/${address}`);
        setBalance(balance);
    }

    return (
        <div className="container wallet">
            <h1>My Wallet</h1>

            <label>
                    Add new wallet
                    <input placeholder="My new wallet" value={newWalletName} onChange={setValue(setNewWalletName)} />
                </label>

            <button className="button" onClick={addWallet}>Add new wallet</button>

            <hr />
            <hr width="100%" size="10px" />

            <h2>Choose active wallet</h2>

            <label>
                Wallet Address
                <select onChange={onSelectWallet} value={wallet}>
                    <option value="" disabled selected hidden>choose a wallet</option>
                    {Array.from(crypto.wallets.keys()).map((u, i) => (
                        <option key={i} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
            </label>
            
            <div className="balance">Balance: {balance}</div>
            <div className="balance">Address: { crypto.getAddress(wallet) }</div>

            <hr />
            <hr width="100%" size="10px" />

            <Transfer 
              wallet={wallet}
              setWalletBalance={setBalance}
              checkedBalanceAddress={checkedBalanceAddress}
              checkedBalance={checkedBalance}
              setCheckedBalance={setCheckedBalance}
            />
           
        </div>
    );
}

export default MyWallet;