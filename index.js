const express = require("express");
const config = require("config");
const app = express();
const mongoose = require("mongoose");
const PORT = config.get("serverPort");
const auth = require("./auth.routes");
const cors = require("cors");

app.use(express.json());
app.use("/api", auth);
app.use(cors());

mongoose.connect(config.get("dbUrl"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.listen(PORT, () => {
  console.log("Server was started at", PORT);
});
