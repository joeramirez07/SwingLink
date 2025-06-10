const express = require("express");
const router = express.Router();
const postsCtrl = require("../controllers/posts");
const ensureLoggedIn = require("../middleware/ensureLoggedIn");

router.use(ensureLoggedIn);
router.get("/", postsCtrl.index);
router.post("/", postsCtrl.create);

module.exports = router;
