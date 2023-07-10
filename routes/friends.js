const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend_controller');

// Send a friend request
router.post('/friendship/request', friendController.sendFriendRequest);

// Accept a friend request
router.post('/friendship/accept', friendController.acceptFriendRequest);

// Remove a friend
router.post('/friendship/remove', friendController.removeFriend);

module.exports = router;
