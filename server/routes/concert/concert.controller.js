const { Concert } = require("../../models/universal.models");

exports.getAll = async (req, res) => {
  try {
    const allConcerts = await Concert.find();
    if (!allConcerts.length)
      res.status(404).json({ message: "Not found any concert in DB" });
    else res.json(allConcerts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.postDoc = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;
    const concert = new Concert({ performer, genre, price, day, image });
    await concert.save();
    res.json({ message: "OK" });
    console.log("Post");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  const concert = await Concert.findById(id);
  if (concert) res.json(concert);
  else res.json({ message: "Concert not found in DB" }).status(404);
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    let dep = await Concert.findByIdAndDelete({ _id: id });
    res.json({ message: dep || "Not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: ("error: ", err) });
  }
};

exports.putDoc = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  try {
    const dep = async () => {
      let x = await Concert.findById(req.params.id);
      return x;
    };

    const depFromDb = await dep();
    if (depFromDb) {
      await Concert.updateOne(depFromDb, {
        $set: { performer, genre, price, day, image },
      });
      res.json({
        message: "OK",
      });
    } else {
      res.status(404).json({ message: "Record not foundd in DB" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.findConcertByPrice = async (req, res) => {
  let min = req.params.price_min;
  let max = req.params.price_max;
  try {
    const concerts = await Concert.find({ price: { $gte: min, $lte: max } });
    if (concerts.length) res.json(concerts);
    else
      res
        .json({ message: "No concerts find in db in selected price range" })
        .status(404);
  } catch (err) {
    res.json({ message: err });
  }
};

exports.findConcertsByParam = async (req, res) => {
  try {
    let key = Object.keys(req.params)[0];
    let value = req.params[key];
    const regForDigits = new RegExp("^[0-9]+$");
    const isDigRegTest = regForDigits.test(value);
    const foundConc = await Concert.find({
      [key]: isDigRegTest ? value : { $regex: new RegExp(value, "i") },
    });
    if (foundConc.length) res.json(foundConc);
    else res.status(404).json({ message: `Not concerts found by ${key}` });
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
};
