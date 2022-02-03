const express = require("express");
const router = express.Router();
const randomID = require("@przemo41/randomid-generator");

//Import and declare array as database
const database = require("../db");
const db = [...database.seats];

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
      db.some((element) => {
        if (element.seat == seat && element.day == day) {
          res.status(404).json({ msg: "seat is taken on the day" });
          console.log("taken");
        }
        return res.statusCode == 404;
      });
      db.push({
        id: randomID(5),
        day,
        seat,
        client,
        email,
      });
      if (res.statusCode !== 404) res.send([...db]);
    } else {
      res.status(404).json({ msg: "some params missing" });
    }
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
