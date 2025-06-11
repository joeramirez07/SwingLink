const express = require("express");
const router = express.Router();
const outingsCtrl = require("../controllers/outings");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

router.post("/:groupId/outings", ensureLoggedIn, outingsCtrl.create);

router.post("/outings/:outingId/rsvp", ensureLoggedIn, outingsCtrl.addRsvp);

module.exports = router;
