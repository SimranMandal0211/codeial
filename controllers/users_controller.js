const User = require('../models/user');


module.exports.profile = function(request, respond){
    // return respond.end('<h1>User Profile</h1>');

    // return respond.render('user_profile', {
    //     title: "user_profile"
    // });

    if(request.cookies.user_id){
        User.findById(request.cookies.user_id, function(err, user){
            if(err){ console.log('err in finding user in profile'); return; }
            if(user){
                return respond.render('user_profile', {
                    title: "User profile",
                    user: user
                })
            }
            else{
                return respond.redirect('/users/sign-in');
            }
        });
    }
    else{
        return respond.redirect('/users/sign-in');
    }
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
    User.findOne({email: request.body.email}).then((user) => {

        if(!user){
            User.create(request.body).then((user) => {
                return respond.redirect('/users/sign-in');
            }).catch((err) => {
                console.log(err);
                return respond.redirect('back');
            })
        }
        else{
            return respond.redirect('back');
        }
}).catch((err) => {
    console.log(err);
})

// -----same as above but due to callback in Model.findOne() this showing error. so we used promises to solve this issue---------------
    // User.findOne({email: request.body.email}, function(err, user){
    //     if(err){    console.log('error in finding in signing up');  return; }

    //     if(!user){
    //         User.create(request.body, function(err, user){
    //             if(err){    console.log('error in creating user while signing up');
    //                 return}

    //             return respond.redirect('/users/sign-in');
    //         })
    //     }else{  //if user already exist we send back to sign-in page
    //         return respond.redirect('back');
    //     }
    // });
}

// get the signIn data
module.exports.createSession = function(request, respond){
    // steps to authenticate
    // Find user found

    User.findOne({email: request.body.email}, function(err, user){
        if(err){    console.log('error in finding in signing in');  return; }

        // handle user found
        if(user){
            // handle password which don't match 
            if(user.password != request.body.password){
                return respond.redirect('back');
            }
            // handle session creation
            respond.cookie('user_id', user.id);
            return respond.redirect('/users/profile');
        }
        else{
            // handle user not found
            return respond.redirect('back');
        }

    });
}