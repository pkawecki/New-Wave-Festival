const express = require("express");
const router = express.Router();
const randomID = require("@przemo41/randomid-generator");

//Import and declare array as database
const database = require("../db");
let db = [...database.seats];

//Reset db function
const reloadDb = () => {
  db = [];
  db = [...database.seats];
};

// Reset db endpoint
router.route("/reload").get((req, res) => {
  console.log("Reloaded");
  reloadDb();
  res.json(db);
});

// "/" Endpoint
router
  .route("/")
  .get((req, res) => {
    console.log("Get all seats");
    res.json(db);
  })
  .post((req, res) => {
    const { day, seat, client, email } = req.body;
    console.log("Post");
    if (day && seat && client && email) {
      db.push({
        id: randomID(5),
        day,
        seat,
        client,
        email,
      });
    } else {
      res.json({ msg: "some params missing" });
    }
    res.json(db);
  });

// "/:id Endpoint"
router
  .route("/:id")
  .get((req, res) => {
    let obj = db.find((x) => x.id == req.params.id);
    console.log(obj);
    if (!obj) res.status(404).json({ message: "not found" });
    res.json(obj);
  })
  .delete((req, res) => {
    let obj = db.find((x) => x.id == req.params.id);
    let index = db.indexOf(obj);
    index !== -1 ? db.splice(index, 1) : null;
    res.json(db);
  })
  .put((req, res) => {
    let { day, seat, client, email } = req.body;
    let id = req.params.id;
    db = db.map((x) => {
      if (x.id == id) {
        return { id: req.params.id, day, seat, client, email };
      } else return x;
    });
    console.log(db);
    res.json(db);
  });

module.exports = router;
