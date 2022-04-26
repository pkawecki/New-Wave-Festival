const { Seat } = require("../../models/universal.models");
var sanitize = require("mongo-sanitize");

exports.getAll = async (req, res) => {
  try {
    const allSeats = await Seat.find();
    if (!allSeats.length)
      res.status(404).json({ message: "Not found any seat in DB" });
    else res.json(allSeats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.postDoc = async (req, res) => {
  try {
    console.log("insane ", req.body.client);
    const client = sanitize(req.body.client);
    console.log("sane ", client);

    const { day, seat, email } = req.body;
    const seatElem = new Seat({ day, seat, client, email });
    await seatElem.save();
    res.json({ message: "OK" });
    console.log("Post");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  const seat = await Seat.findById(id);
  if (seat) res.json(seat);
  else res.json({ message: "Seat not found in DB" }).status(404);
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    let dep = await Seat.findByIdAndDelete({ _id: id });
    res.json({ message: dep || "Not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: ("error: ", err) });
  }
};

exports.putDoc = async (req, res) => {
  const { day, seat, client, email } = req.body;
  try {
    const dep = async () => {
      let x = await Seat.findById(req.params.id);
      return x;
    };

    const depFromDb = await dep();
    if (depFromDb) {
      await Seat.updateOne(depFromDb, {
        $set: { day, seat, client, email },
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
