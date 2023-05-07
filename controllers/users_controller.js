const User = require('../models/user');


module.exports.profile = function(request, respond){
    // return respond.end('<h1>User Profile</h1>');

    return respond.render('user_profile', {
        title: "user_profile"
    });
}

// render the sign up page
module.exports.signUp = function(request, respond){
    return respond.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// render the sign in page
module.exports.signIn = function(request, respond){
    return respond.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}

// get the signUp data
module.exports.create = function(request, respond){
    // first we check pswd & confirm pswd same or not
    if(request.body.password != request.body.confirm_password){
        return respond.redirect('back');
    }
    User.findOne({email: request.body.email}, function(err, user){
        if(err){    console.log('error in finding in signing up');  return; }

        if(!user){
            User.create(request.body, function(err, user){
                if(err){    console.log('error in creating user while signing up');
                    return}

                return respond.redirect('/users/sign-in');
            })
        }else{  //if user already exist we send back to sign-in page
            return respond.redirect('back');
        }
    });
}

// get the signIn data
module.exports.createSession = function(request, respond){
    //TODO Later
}