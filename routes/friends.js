const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friend_controller');

// Send a friend request
router.post('/friendship/add', friendController.addFriend);

// Accept a friend request
// router.post('/friendship/accept', friendController.acceptFriendRequest);

// Remove a friend
router.get('/friendship/remove/:id', friendController.removeFriend);

module.exports = router;
