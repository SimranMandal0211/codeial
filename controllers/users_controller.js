const User = require('../models/user');


module.exports.profile = function(request, respond){
    // return respond.end('<h1>User Profile</h1>');

    User.findById(request.params.id, function(err, user){
        return respond.render('user_profile', {
            title: "user_profile",
            profile_user: user
        });
    });
    
    // if(request.cookies.user_id){
    //     User.findById(request.cookies.user_id, function(err, user){
    //         if(err){ console.log('err in finding user in profile'); return; }
    //         if(user){
    //             return respond.render('user_profile', {
    //                 title: "User profile",
    //                 user: user
    //             })
    //         }
    //         else{
    //             return respond.redirect('/users/sign-in');
    //         }
    //     });
    // }
    // else{
    //     return respond.redirect('/users/sign-in');
    // }
}

// render the sign up page
module.exports.signUp = function(request, respond){
    
    if(request.isAuthenticated()){
        return respond.redirect('/users/profile');
    }
    
    return respond.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// render the sign in page
module.exports.signIn = function(request, respond){

    if(request.isAuthenticated()){
        return respond.redirect('/users/profile');
    }

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
                console.log('error in creating user while signing up ',err);
                return respond.redirect('back');
            })
        }
        else{   //if user already exist we send back to sign-in page
            return respond.redirect('back');
        }
}).catch((err) => {
    console.log('error in finding in signing up', err);
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
    // -------------Manual-----------------
    // steps to authenticate
    // Find user found

    // User.findOne({email: request.body.email}, function(err, user){
    //     if(err){    console.log('error in finding in signing in');  return; }

    //     // handle user found
    //     if(user){
    //         // handle password which don't match 
    //         if(user.password != request.body.password){
    //             return respond.redirect('back');
    //         }
    //         // handle session creation
    //         respond.cookie('user_id', user.id);
    //         return respond.redirect('/users/profile');
    //     }
    //     else{
    //         // handle user not found
    //         return respond.redirect('back');
    //     }

    // });
    // -------------------------------------

// Using Passport
    return respond.redirect('/');
}

// --------------Manual Authentication -----------------
// module.exports.signOut = function(request, respond){
//     // return respond.end('<h1>Sign-Out!! Congo You did it very well!! </h1>');

//     respond.clearCookie('user_id');
//     console.log("cookie clear");
//     return respond.render('user_sign_out',{
//         title: "Codeial | Sign Out"
//     })
// }
// ---------------------------------------------------

module.exports.destroySession = function(request, respond){
    request.logout(function(err) {
        if (err) { return next(err); }
        respond.redirect('/');
      });
}

module.exports.update = function(request, respond){
    if(request.user.id == request.params.id){
        User.findByIdAndUpdate(request.params.id, request.body, function(err, user){
            return respond.redirect('back');
        });
    }else{
        return respond.status(401).send('Unauthorized');
    }
}