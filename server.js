const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const config = require("./config");

const port = config.server.port || 3000;
const address = config.server.address || "0.0.0.0";

// Load SSL certificate and key
const privatekey = fs.readFileSync(config.server.sslKeyPath, "utf8");
const certificate = fs.readFileSync(config.server.sslCertPath, "utf8");
const credentials = {
  key: privatekey,
  cert: certificate,
};


const tournamentRoutes = require("./routes/tournament-routes");
const leaderboardRoutes = require("./routes/leaderboard-routes");
const playerRoutes = require("./routes/player-routes");

app.use(express.json());


app.use("/tournaments", tournamentRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/players", playerRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, address, () => {
  console.log(`HTTPS Server is running on port ${port}`);
});

const http = require("http");
const { Console } = require("console");
const httpApp = express();
httpApp.use((req, res, next) => {
  if (req.protocol === "http") {
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});
http.createServer(httpApp).listen(8080);
httpApp.use(app);
