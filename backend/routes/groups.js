const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groups");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

router.use(ensureLoggedIn);
router.get("/", groupsController.getUserGroups);
router.post("/", groupsController.createGroup);
router.post("/join", groupsController.joinGroup);
router.post("/join", ensureLoggedIn, groupsController.joinGroupByInviteCode);
router.get("/:id", groupsController.getGroupDetails);
router.post("/:groupId/outings", groupsController.createOuting);
router.put("/:groupId/outings/:outingId/rsvp", groupsController.rsvpToOuting);
router.delete("/:id", groupsController.deleteGroup);

module.exports = router;
