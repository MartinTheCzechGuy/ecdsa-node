import { useState } from "react";
import server from "./server";
import crypto from "./crypto.js";

function Transfer({ wallet, setWalletBalance, checkedBalanceAddress, checkedBalance, setCheckedBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    if (!recipient) {
      alert("recipient has to be set")
      return
    }

    if (sendAmount == "") {
      alert("amount has to be set")
      return
    }

    const message = { amount: parseInt(sendAmount), recipient};
    const signature = await crypto.sign(wallet, message);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, { message, signature });
      setWalletBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
      return
    }

    // lil hack to get the balance in `CheckBalance` updated if needed.
    if (recipient == checkedBalanceAddress) {
      setCheckedBalance(checkedBalance + parseInt(sendAmount));
    } 
  }

  return (
    <form className="transfer" onSubmit={transfer}>
      <h2>Send Transaction</h2>

      <label>
        Send Amount
        <input
          placeholder="Amount to transfer"
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
