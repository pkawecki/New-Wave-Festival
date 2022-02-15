const express = require("express");
const router = express.Router();
const ConcCtrl = require("./concert.controller");

// "/" Endpoint
router.route("/").get(ConcCtrl.getAll).post(ConcCtrl.postDoc);

// "/:id Endpoint"
router
  .route("/:id")
  .get(ConcCtrl.getById)
  .delete(ConcCtrl.delete)
  .put(ConcCtrl.putDoc);

// performer/:performer Endpoint -- find performer concerts
router.route("/performer/:performer").get(ConcCtrl.findConcertsByParam);

// genre/:genre -- find concerts by genre
router.route("/genre/:genre").get(ConcCtrl.findConcertsByParam);

// concerts/price/:price_min/:price_max
router.route("/price/:price_min/:price_max").get(ConcCtrl.findConcertByPrice);

//concerts/day/:day
router.route("/day/:day").get(ConcCtrl.findConcertsByParam);

//export module
module.exports = router;
