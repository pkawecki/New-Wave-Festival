const express = require("express");
const router = express.Router();
const SeatCtrl = require("./seat.controller");

// "/" Endpoint
router.route("/").get(SeatCtrl.getAll).post(SeatCtrl.postDoc);

// "/:id Endpoint"
router
  .route("/:id")
  .get(SeatCtrl.getById)
  .delete(SeatCtrl.delete)
  .put(SeatCtrl.putDoc);

module.exports = router;
