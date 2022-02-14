const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  text: { type: String, required: true },
});

const concertSchema = new mongoose.Schema({
  //   id: { type: mongoose.Types.ObjectId },
  performer: { type: String, required: true },
  genre: { type: String, required: true },
  price: { type: Number, required: true },
  day: { type: Number, required: true },
  image: { type: String, required: true },
});

const seatSchema = new mongoose.Schema({
  day: { type: String, required: true },
  seat: { type: String, required: true },
  client: { type: String, required: true },
  email: { type: String, required: true },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
const Concert = mongoose.model("Concert", concertSchema);
const Seat = mongoose.model("Seat", seatSchema);

module.exports = { Testimonial, Concert, Seat };
