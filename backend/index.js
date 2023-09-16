const express = require("express");
const cors = require("cors");

const PORT = 5000;

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

app.use("/authenticate", async (req, res) => {
  const { username } = req.body;
});

app.listen(PORT, () => {
  console.log("back end is running at port", PORT);
});
