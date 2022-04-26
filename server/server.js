const express = require("express");
const app = express();
var cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());

//DATABASE PASS TO REQUEST

app.use((req, res, next) => {
  req.db = db;
  next();
});

//ROUTING
const testimonials = require("./routes/testimonial/testimonials.routes");
const concerts = require("./routes/concert/concerts.routes");
const seats = require("./routes/seat/seats.routes");
const API_URL = require("./config");

app.use("/testimonials", testimonials);
app.use("/concerts", concerts);
app.use("/seats", seats);

// MONGOOSE DATABASE CONNECTION CONFIG
const NODE_ENV = process.env.NODE_ENV;
let dbUri = "";

if (NODE_ENV === "production")
  dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.oavbq.mongodb.net/Cluster1?retryWrites=true`;
else if (NODE_ENV === "test") dbUri = "mongodb://localhost:27017/NewWaveDB";
else dbUri = "mongodb://localhost:27017/NewWaveDB";

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// DATABSE CONNECTION LISTENERS
db.once("open", () => {
  console.log(
    "Connceted to database: ",
    dbUri,
    "\n mode:",
    process.env.NODE_ENV
  );
});
db.on("error", (err) => console.log("Error: ", err));

// app.use((req, res) => {
//   res.status(404).send({ message: "Not found..." });
// });

//RUN server
const PORT = process.env.PORT;
const server = app.listen(PORT || 8000, () => {
  console.log("Server is running on port:", PORT || 8000);
});

//SOCKET CONF
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000", methods: ["*"] },
});

io.on("connection", (client) => {
  const socketId = client.id;
  const clientIp = client.request.connection.remoteAddress;
  console.log(`client connected. IP:  ${clientIp}, socketId: ${socketId}`);
});

// APPLY SOCKET  MIDLDEWARE TO BE USED ON ENDPOTINS
app.use((req, res, next) => {
  req.io = io;
  next();
});

//SERVE STATIC FILES FOR REACT APP.
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

//404 NOT FOUND Logging
app.use((req, res) => {
  let msg = { message: "Not found" };
  res.status(404).json(msg);
});

module.exports = server;
