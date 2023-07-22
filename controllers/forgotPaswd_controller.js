const User = require('../models/user'); 
const ForgotPswd = require('../models/forgotPassword');

module.exports.forgot = function(request, respond){
    // return respond.end('<h1>forgot password</h1>');

    return respond.render('forgot-password', {
        title: "Codeial | Forgot Password"
    })
}
