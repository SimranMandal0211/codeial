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