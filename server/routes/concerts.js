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
    if (obj) res.json(obj);
    else res.status(404).json({ message: "not found" });
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

// performer/:performer
router.route("/performer/:performer").get((req, res) => {
  let chosenPerformers = db.filter((x) => x.performer == req.params.performer);
  if (chosenPerformers.length) res.json(chosenPerformers);
  else res.status(404).json({ message: "not found" });
});

// genre/:genre

router.route("/genre/:genre").get((req, res) => {
  let chosenGenre = db.filter((x) => x.genre == req.params.genre);
  if (!chosenGenre.length) res.status(404).json({ message: "not found" });
  else res.json(chosenGenre).status(200);
});

// concerts/price/:price_min/:price_max
router.route("/price/:price_min/:price_max").get((req, res) => {
  let min = req.params.price_min;
  let max = req.params.price_max;
  let concerts = db.filter((x) => x.price >= min && x.price <= max);
  if (!concerts) res.status(404).json({ message: "not found" });
  res.json(concerts).status(200);
});

//concerts/day/:day
router.route("/day/:day").get((req, res) => {
  const day = parseInt(req.params.day);
  const concerts = db.filter((x) => x.day === day);
  if (!concerts) res.status(404).json({ message: "not found" });
  else res.json(concerts).status(200);
});

//Reset db
router.route("/reload").get((req, res) => {
  console.log("Reloaded");
  reloadDb();
  res.json(db);
});

module.exports = router;
