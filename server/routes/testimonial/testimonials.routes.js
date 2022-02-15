const express = require("express");
const router = express.Router();
const Testimonial = require("./testimonials.controller");

//GET endpoints
router.route("/").get(Testimonial.getAll);
router.route("/random").get(Testimonial.getRandom);
router.route("/:id").get(Testimonial.getById);

//POST Endpoints
router.route("/").post(Testimonial.postDoc);

//PUT Endpoints
router.route("/:id").put(Testimonial.putDoc).delete(Testimonial.delete);

module.exports = router;
