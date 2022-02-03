const express = require("express");
const router = express.Router();
const randomID = require("@przemo41/randomid-generator");

//Import and declare array as database
const database = require("../db");
let db = [...database.testimonials];

//Reset db
const reloadDb = () => {
  db = [];
  db = [...database.testimonials];
};

//GET endpoints
router.route("/").get((req, res) => {
  res.json(db);
});

router.route("/reload").get((req, res) => {
  console.log("Reloaded");
  reloadDb();
  res.json(db);
});

router.route("/random").get((req, res) => {
  let length = db.length;
  let index = Math.round(Math.random() * (length - 1)) + 1;
  res.json(db.find((x) => x.id === index));
});

router.route("/:id").get((req, res) => {
  let id = req.params.id;
  let obj = db.find((x) => x.id == id);
  console.log(obj);
  if (!obj) res.status(404).json({ message: "not found" });
  res.json(obj);
});

//POST Endpoints
router.route("/").post((req, res) => {
  const { author, text } = req.body;
  if (author && text) {
    db.push({
      id: randomID(5),
      author,
      text,
    });
  }
  res.json(db);
});

//PUT Endpoints
router
  .route("/:id")
  .put((req, res) => {
    let { author, text } = req.body;
    let id = req.params.id;
    db = db.map((x) => {
      if (x.id == id) {
        return { id: id, author: author, text: text };
      } else {
        return x;
      }
    });
    console.log(db);
    res.json(db);
  })
  .delete((req, res) => {
    let element = db.find((x) => x.id === parseInt(req.params.id));
    let index = db.indexOf(element);
    console.log(index);
    index !== -1 ? db.splice(index, 1) : null;
    res.json(db);
  });

module.exports = router;
