const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// _________aurhentication using Passport________
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){
        // done- callback function reporting back to passport.js

        // find a user and establishe the identity
        User.findOne({email: email}, function(err, user)  {
            if (err){
                console.log('Error in finding user --> Passport');
                return done(err);
            }
            if (!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);
                // null- no error  and  false- authentication
            }
            return done(null, user);
        });
    }
));

// serialize- the user to decide which key is to be kept in the cookies 
// serializeUser- inbuild function

        // (we find id --> sended to cookie --> browser)
passport.serializeUser(function(user,done){
    done(null, user.id);
});

        // browser make request --> deserialize --> find user again)
// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding uer --> Passport');
            return done(err);
        }
        return done(null, user);    //null- no error, user- user found
    })
});

module.exports = passport;