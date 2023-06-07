const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);

router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.get('/sign-out', usersController.destroySession);

router.post('/create', usersController.create);

// router.post('/create-session', usersController.createSession);       //----Manual authentication----;
        // use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
        'local',
        {failureRedirect: '/users/sign-in', failureFlash: 'Invalid Username/ Password'}
    ),usersController.createSession); 

// router.post('/sign-out', usersController.signOut);                   //----Manual authentication----;

module.exports = router;