// Create this file: routes/groups.js
const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groups');
const ensureLoggedIn = require('../middleware/ensureLoggedIn');

// All group routes require authentication
router.use(ensureLoggedIn);

// GET /api/groups - Get all user's groups
router.get('/', groupsController.getUserGroups);

// POST /api/groups - Create new group
router.post('/', groupsController.createGroup);

// POST /api/groups/join - Join group via invite code
router.post('/join', groupsController.joinGroup);

// GET /api/groups/:id - Get specific group details
router.get('/:id', groupsController.getGroupDetails);

// POST /api/groups/:groupId/outings - Create outing in group
router.post('/:groupId/outings', groupsController.createOuting);

// PUT /api/groups/:groupId/outings/:outingId/rsvp - RSVP to outing
router.put('/:groupId/outings/:outingId/rsvp', groupsController.rsvpToOuting);

module.exports = router;
