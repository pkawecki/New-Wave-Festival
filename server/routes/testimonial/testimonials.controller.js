const { Testimonial } = require("../../models/universal.models");

exports.getAll = async (req, res) => {
  try {
    const allTestimonials = await Testimonial.find();
    if (!allTestimonials.length)
      res.status(404).json({ message: "Not found any testimonial in DB" });
    else res.json(allTestimonials);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getRandom = (req, res) => {
  req.db
    .collection("testimonials")
    .aggregate([{ $sample: { size: 1 } }])
    .toArray((err, data) => {
      if (err) res.status(500).json({ message: err });
      else res.json(data);
    });
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  const testimonial = await Testimonial.findById(id);
  if (testimonial) res.json(testimonial);
  else res.json({ message: "Testimonial not found in DB" }).status(404);
};

exports.postDoc = async (req, res) => {
  try {
    const { author, text } = req.body;
    const testimonial = new Testimonial({ author, text });
    await testimonial.save();
    res.json({ message: "OK" });
    console.log("Post");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    let dep = await Testimonial.findByIdAndDelete({ _id: id });
    res.json({ message: dep || "Not found" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: ("error: ", err) });
  }
};

exports.putDoc = async (req, res) => {
  const { author, text } = req.body;
  try {
    const dep = async () => {
      let x = await Testimonial.findById(req.params.id);
      return x;
    };

    const depFromDb = await dep();
    if (depFromDb) {
      await Testimonial.updateOne(depFromDb, {
        $set: { author, text },
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
