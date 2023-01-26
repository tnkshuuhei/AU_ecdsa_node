const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "044a486ac7fe08fe250cd9e6eccf4309ba90fcaa29faad90a17734cff1a430a190c7589bf823d63b2511b69a95fa94ecb1e0f32891fbbf0622652eb7e7a495b743": 100,
  "04f0bf98f64911c577241ad567bf581d3e91a4e2397758d629f3bdfeebac827a1ef56efbb23e90eca69e4332067fc88ad1b6a1873bc690d8015dadb43e61f5ed5b": 50,
  "04de96392eba925ab014ed53b71e7d21e0a1d58aada513472db8a4ee7edeabf5a4e4324e006a20536ff34b2c83167606b28412dfa751d1d36f04daa05a934376ef": 75,
};

app.get("/balance/:address", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
