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

//Use of middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

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
app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
});
