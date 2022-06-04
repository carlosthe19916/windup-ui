const express = require("express");
const path = require("path");
const app = express(),
  bodyParser = require("body-parser");

// const setupProxy = require("./src/setupProxy");

port = 3000;

// setupProxy(app);
expressInstance = express.static(path.join(__dirname, "build"), {
  extensions: ["json"],
});

app.use(bodyParser.json());
app.use(expressInstance);

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
