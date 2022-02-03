const express = require("express");
const app = express();
var cors = require("cors");
const randomID = require("@przemo41/randomid-generator");
const { message } = require("statuses");
const path = require("path");

//Import routes
const testimonials = require("./routes/testimonials");
const concerts = require("./routes/concerts");
const seats = require("./routes/seats");
const API_URL = require("./config");

//Use of middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Apply midldeware to be used on endpotins
// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

//Use endpoints from external files
app.use("/testimonials", testimonials);
app.use("/concerts", concerts);
app.use("/seats", seats);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// //GET for database reset
// app.get("/reload", (req, res) => {
//   console.log("Reloaded");
//   reloadDb();
//   res.send(db);
// });

//404 NOT FOUND Logging
app.use((req, res, next) => {
  let msg = { message: "Not found" };
  res.status(404).json(msg);
});

//RUN server
const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
  console.log(API_URL);
});

//Socket
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:3000", methods: ["*"] },
});

io.on("connection", (client) => {
  console.log("client connected");
});
