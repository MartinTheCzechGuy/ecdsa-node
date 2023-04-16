const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("./crypto");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = new Map([
  ["706FE7AC862E9E414C908152D8488FFDC2FA8CA2", 100],
  ["E496A1EE8F0AFD2A771DCD86215B7501129538ED", 50], 
  ["D277C3A3B14612DF19CE85BB67A942F562999C2B", 75], 
  ["4B14C4F5003027B981A848B36708DBF907DA6EEE", 120],
]);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances.get(address) || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature } = req.body;
  const { recipient, amount } = message;
  
  const publicKey = crypto.signatureToPubKey(message, signature);
  const sender = crypto.pubKeyToAddress(publicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  console.log("recipient -> ", recipient);

  if (balances.get(sender) < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances.set(sender, balances.get(sender) - amount);
    if (!balances.has(recipient)) {
      balances.set(recipient, 0);
    }
    balances.set(recipient, balances.get(recipient) + amount);
    console.log("balance -> ", balances.get(recipient));
    res.send({ balance: balances.get(sender) });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
