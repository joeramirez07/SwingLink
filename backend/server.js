const path = require("path");
const express = require("express");
const logger = require("morgan");
const app = express();

require("dotenv").config();
require("./db");

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(express.json());
app.use(require("./middleware/checkToken"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/outings", require("./routes/outings"));

app.get("/*splat", function (req, res) {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`The express app is listening on ${port}`);
});
