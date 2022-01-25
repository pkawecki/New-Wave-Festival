const express = require("express");
const router = express.Router();
const randomID = require("@przemo41/randomid-generator");

//Import and declare array as database
const database = require("../db");
let db = [...database.concerts];

//Reset db function
const reloadDb = () => {
  db = [];
  db = [...database.concerts];
};

// "/" Endpoint
router
  .route("/")
  .get((req, res) => {
    res.json(db);
  })
  .post((req, res) => {
    const { performer, genre, price, day, image } = req.body;
    console.log("Post");
    if (performer && genre && price && day && image) {
      db.push({
        id: randomID(5),
        performer,
        genre,
        price,
        day,
        image,
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
    let { performer, genre, price, day, image } = req.body;
    let id = req.params.id;
    db = db.map((x) => {
      if (x.id == id) {
        return { id, performer, genre, price, day, image };
      } else return x;
    });
    console.log(db);
    res.json(db);
  });

//Reset db
router.route("/reload").get((req, res) => {
  console.log("Reloaded");
  reloadDb();
  res.json(db);
});

module.exports = router;
